import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationTemplateService } from '../../../../../core/services/api/application-templates.service';
import { FormDropdownComponent } from '../../../form-dropdown/form-dropdown.component';

@Component({
  selector: 'app-create-template-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FormDropdownComponent],
  templateUrl: './create-template-modal.component.html',
  styleUrls: ['./create-template-modal.component.css'],
})
export class CreateTemplateModalComponent implements OnInit {
  @Input() templateId: string | undefined = undefined;
  @Input() initialData: any = null;

  private service = inject(ApplicationTemplateService);

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  templateName = 'Standard Membership Application';

  fieldTypeDropdownOptions = [
    { value: 'text', label: 'Short Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'file', label: 'File' },
    { value: 'enum', label: 'Enum' },
  ];

  repeatModeDropdownOptions = [
    { value: 'ExactValue', label: 'Exact' },
    { value: 'AtLeastOne', label: 'At Least' },
  ];

  selectedStepIndex = 0;
  selectedSectionIndex = 0;

  selectedStep: any = null;
  selectedSection: any = null;
  selectedField: any = null;

  selectedType: 'step' | 'section' | 'field' | null = null;

  dragField: any = null;
  dragSection: any = null;

  enumInput = '';

  steps: any[] = [
    {
      title: 'Personal Information',
      sections: [
        {
          title: 'Basic Details',
          fields: [
            {
              key: 'full_name',
              label: 'Full Name',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ];

  fieldTypes = [
    { label: 'Short Text', type: 'text', icon: 'fa-solid fa-align-left' },
    { label: 'Number', type: 'number', icon: 'fa-solid fa-hashtag' },
    { label: 'Date', type: 'date', icon: 'fa-solid fa-calendar' },
    { label: 'File', type: 'file', icon: 'fa-solid fa-file' },
    { label: 'Enum', type: 'enum', icon: 'fa-solid fa-list' },
  ];

  formatToInputDate(isoString: any): string | null {
    if (!isoString) return null;
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return null;
      return isoString.substring(0, 10);
    } catch {
      return null;
    }
  }

  getFallbackFamilyFields(): any[] {
    return [
      {
        key: 'sys_family_member_full_name',
        fieldType: 'Text',
        type: 'text',
        validationRules: {
          isRequired: true,
          minLength: 2,
          maxLength: 100
        },
        canOverride: {
          isRequired: false,
          minLength: false,
          maxLength: false,
          minValue: false,
          maxValue: false,
          minDate: false,
          maxDate: false
        }
      },
      {
        key: 'sys_family_member_dob',
        fieldType: 'Date',
        type: 'date',
        validationRules: {
          isRequired: true,
          minDate: '1900-01-01T00:00:00.000Z',
          maxDate: new Date().toISOString()
        },
        canOverride: {
          isRequired: false,
          minLength: false,
          maxLength: false,
          minValue: false,
          maxValue: false,
          minDate: true,
          maxDate: true
        }
      },
      {
        key: 'sys_family_member_relationship',
        fieldType: 'Enum',
        type: 'enum',
        allowedValues: ['Father', 'Mother', 'Spouse', 'Son', 'Daughter'],
        validationRules: {
          isRequired: true
        },
        canOverride: {
          isRequired: false,
          minLength: false,
          maxLength: false,
          minValue: false,
          maxValue: false,
          minDate: false,
          maxDate: false
        }
      }
    ];
  }

  enrichSystemSections() {
    const hasSystemSection = this.steps.some(step =>
      (step.sections || []).some((sec: any) => sec.system || sec.intent === 'FamilyMembers')
    );

    if (!hasSystemSection) {
      return;
    }

    this.service.getSystemSection('FamilyMembers').subscribe({
      next: (res: any) => {
        console.log('✅ Loaded blueprint for enrichment:', res);
        this.steps.forEach((step) => {
          (step.sections || []).forEach((section: any) => {
            if (section.system || section.intent === 'FamilyMembers') {
              section.intent = 'FamilyMembers';
              section.system = true;
              section.fields.forEach((field: any) => {
                const blueprintField = (res.fields || []).find((f: any) => f.key === field.key);
                if (blueprintField) {
                  const blueprintRules = blueprintField.validationRules || blueprintField.ruleSet || {};
                  const canOverride = blueprintField.validationRulesCanBeOverriden || {};

                  field.canOverride = canOverride;

                  const apiFieldType = blueprintField.type || blueprintField.fieldType;
                  if (apiFieldType) {
                    field.fieldType = apiFieldType;
                    field.type = this.reverseMapFieldType(apiFieldType);
                  }
                  if (blueprintField.allowedValues) {
                    field.allowedValues = blueprintField.allowedValues;
                  }

                  if (!field.validationRules) {
                    field.validationRules = { ...blueprintRules };
                  }

                  const ruleKeys = ['isRequired', 'minLength', 'maxLength', 'minValue', 'maxValue', 'minDate', 'maxDate'];
                  ruleKeys.forEach((key) => {
                    const cannotOverride = !canOverride[key];
                    const isMissing = field.validationRules[key] === undefined || field.validationRules[key] === null;

                    if (cannotOverride || isMissing) {
                      field.validationRules[key] = blueprintRules[key];
                    }
                  });

                  field.required = field.validationRules.isRequired ?? false;
                  field.minLength = field.validationRules.minLength;
                  field.maxLength = field.validationRules.maxLength;
                  field.minValue = field.validationRules.minValue;
                  field.maxValue = field.validationRules.maxValue;
                  field.minDate = this.formatToInputDate(field.validationRules.minDate);
                  field.maxDate = this.formatToInputDate(field.validationRules.maxDate);
                }
              });
            }
          });
        });
      },
      error: (err) => {
        console.error('❌ Failed to load blueprint for enrichment, using fallback metadata:', err);
        const fallbackFields = this.getFallbackFamilyFields();
        this.steps.forEach((step) => {
          (step.sections || []).forEach((section: any) => {
            if (section.system || section.intent === 'FamilyMembers') {
              section.intent = 'FamilyMembers';
              section.system = true;
              section.fields.forEach((field: any) => {
                const fallbackField = fallbackFields.find((f: any) => f.key === field.key);
                if (fallbackField) {
                  field.canOverride = fallbackField.canOverride;

                  const apiFieldType = fallbackField.fieldType;
                  if (apiFieldType) {
                    field.fieldType = apiFieldType;
                    field.type = this.reverseMapFieldType(apiFieldType);
                  }
                  if (fallbackField.allowedValues) {
                    field.allowedValues = fallbackField.allowedValues;
                  }

                  if (!field.validationRules) {
                    field.validationRules = { ...fallbackField.validationRules };
                  }
                  
                  const ruleKeys = ['isRequired', 'minLength', 'maxLength', 'minValue', 'maxValue', 'minDate', 'maxDate'];
                  ruleKeys.forEach((key) => {
                    const cannotOverride = !fallbackField.canOverride[key];
                    const isMissing = field.validationRules[key] === undefined || field.validationRules[key] === null;

                    if (cannotOverride || isMissing) {
                      field.validationRules[key] = fallbackField.validationRules[key];
                    }
                  });

                  field.required = field.validationRules.isRequired ?? false;
                  field.minLength = field.validationRules.minLength;
                  field.maxLength = field.validationRules.maxLength;
                  field.minValue = field.validationRules.minValue;
                  field.maxValue = field.validationRules.maxValue;
                  field.minDate = this.formatToInputDate(field.validationRules.minDate);
                  field.maxDate = this.formatToInputDate(field.validationRules.maxDate);
                }
              });
            }
          });
        });
      }
    });
  }

  ngOnInit(): void {
    if (this.initialData) {
      this.templateName = this.initialData.name;

      this.steps = (this.initialData.steps || []).map((step: any) => ({
        ...step,

        sections: (step.sections || []).map((section: any) => ({
          ...section,

          system: section.intent === 'FamilyMembers',

          repeatable: section.repeatRule ? (section.repeatRule.mode === 'AtLeastOne' || section.repeatRule.numberOfRepeats > 1) : false,
          repeatMode: section.repeatRule?.mode || 'ExactValue',
          numberOfRepeats: section.repeatRule?.numberOfRepeats || 1,

          fields: (section.fields || []).map((field: any) => ({
            ...field,

            fieldType: field.fieldType,

            type: this.reverseMapFieldType(field.fieldType),

            required: field.validationRules?.isRequired ?? false,

            minLength: field.validationRules?.minLength,
            maxLength: field.validationRules?.maxLength,

            minValue: field.validationRules?.minValue,
            maxValue: field.validationRules?.maxValue,

            minDate: this.formatToInputDate(field.validationRules?.minDate),
            maxDate: this.formatToInputDate(field.validationRules?.maxDate),

            allowedValues: field.allowedValues || [],

            system: section.intent === 'FamilyMembers' || field?.key?.startsWith('sys_'),
          })),
        })),
      }));
    }

    this.normalizeSteps();
    this.enrichSystemSections();
  }

  closeModal() {
    this.close.emit();
  }

  /* ================= SAVE ================= */

  save() {
    const payload = {
      templateId: this.templateId,
      name: this.templateName,
      steps: this.mapSteps(),
    };

    console.log('🚀 FINAL PAYLOAD', payload);

    this.submitForm.emit(payload);

    this.closeModal();
  }

  /* ================= MAPPER ================= */

 mapSteps() {
  const safeIsoDate = (val: any) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };

  return this.steps.map((step: any, stepIndex: number) => ({
    id: step.id || undefined,
    title: step.title,
    order: stepIndex,

    sections: (step.sections || []).map((section: any, sectionIndex: number) => ({
      id: section.id || undefined,
      title: section.title,
      order: sectionIndex,
      intent: section.system ? 'FamilyMembers' : 'General',

      repeatRule: {
        mode: section.repeatable ? (section.repeatMode || 'AtLeastOne') : 'ExactValue',
        numberOfRepeats: section.repeatable ? (section.numberOfRepeats || 1) : 1,
      },

      fields: (section.fields || []).map((field: any, fieldIndex: number) => {

        const isSystem = this.isSystemField(field);

        // ================= SYSTEM FIELD =================
        if (isSystem) {
          // الباك إند يطلب `ValidationRules` دائماً، وإذا تم حذف خاصية (مثل isRequired)
          // فإنها تُترجم كـ false، مما يؤدي إلى خطأ "cannot be overridden".
          // لذلك يجب إرسال القواعد الأصلية بالكامل مع تعديل المسموح به فقط.
          const rules: any = { ...(field.validationRules || {}) };

          // للحماية الإضافية (في حالة الفولباك أو نقص البيانات)
          if (rules.isRequired === undefined) {
            rules.isRequired = field.required ?? true;
          }

          if (this.canOverrideRule(field, 'isRequired') && field.required !== undefined) {
            rules.isRequired = field.required;
          }
          if (this.canOverrideRule(field, 'minLength') && field.minLength !== undefined) {
            rules.minLength = field.minLength;
          }
          if (this.canOverrideRule(field, 'maxLength') && field.maxLength !== undefined) {
            rules.maxLength = field.maxLength;
          }
          if (this.canOverrideRule(field, 'minValue') && field.minValue !== undefined) {
            rules.minValue = field.minValue;
          }
          if (this.canOverrideRule(field, 'maxValue') && field.maxValue !== undefined) {
            rules.maxValue = field.maxValue;
          }
          if (this.canOverrideRule(field, 'minDate') && field.minDate !== undefined) {
            rules.minDate = safeIsoDate(field.minDate);
          }
          if (this.canOverrideRule(field, 'maxDate') && field.maxDate !== undefined) {
            rules.maxDate = safeIsoDate(field.maxDate);
          }

          return {
            id: field.id || undefined,
            key: field.key,
            label: field.label || field.key,
            order: fieldIndex,
            // 🔥 حقول النظام يجب أن تحتفظ بنوعها الأصلي دائماً
            fieldType: field.fieldType || 'Text',
            validationRules: rules,
            allowedValues: field.allowedValues || [],
          };
        }

        // ================= NORMAL FIELD =================
        return {
          id: field.id || undefined,
          key: field.key,
          label: field.label || field.key || 'Unnamed Field',
          order: fieldIndex,
          fieldType: field.fieldType || this.mapFieldType(field.type),

          // 🔥 مهم جدًا: ممنوع undefined
          validationRules: {
            isRequired: field.required ?? false,
            minLength: field.minLength ?? null,
            maxLength: field.maxLength ?? null,
            minValue: field.minValue ?? null,
            maxValue: field.maxValue ?? null,
            minDate: safeIsoDate(field.minDate),
            maxDate: safeIsoDate(field.maxDate),
          },

          ...(field.type === 'enum'
            ? { allowedValues: field.allowedValues ?? [] }
            : {}),
        };
      }),
    })),
  }));
}

  isSystemField(field: any): boolean {
    return (
      field?.system === true || field?.key?.startsWith('sys_') || field?.fieldType === 'System'
    );
  }

  canOverrideRule(field: any, ruleName: string): boolean {
    if (!field) return true;
    if (!this.isSystemField(field)) return true;

    // إذا كان حقل نظام، نتحقق من الـ canOverride
    const canOverride = field.canOverride || field.validationRulesCanBeOverriden;
    if (!canOverride) return false; // الافتراضي قفل حقول النظام

    return canOverride[ruleName] === true;
  }

  mapFieldType(type: string) {
    switch (type) {
      case 'text':
        return 'Text';

      case 'number':
        return 'Number';

      case 'date':
        return 'Date';

      case 'file':
        return 'File';

      case 'enum':
        return 'Enum';

      default:
        return 'Text';
    }
  }

  reverseMapFieldType(fieldType: string) {
    switch ((fieldType || '').toLowerCase()) {
      case 'text':
        return 'text';

      case 'number':
        return 'number';

      case 'date':
        return 'date';

      case 'file':
        return 'file';

      case 'enum':
        return 'enum';

      default:
        return 'text';
    }
  }

  /* ================= NORMALIZE ================= */

  normalizeSteps() {
    this.steps.forEach((step) => {
      if (!Array.isArray(step.sections)) {
        step.sections = [];
      }

      step.sections.forEach((section: any) => {
        if (!Array.isArray(section.fields)) {
          section.fields = [];
        }
      });
    });
  }

  /* ================= ADD ================= */

  addStep() {
    const step = {
      title: `Step ${this.steps.length + 1}`,
      sections: [],
    };

    this.steps.push(step);

    this.selectedStepIndex = this.steps.length - 1;

    this.selectedStep = step;

    this.selectedType = 'step';

    this.normalizeSteps();
  }

  addSection() {
    const section = {
      title: 'New Section',
      fields: [],
      repeatable: false,
      repeatMode: 'ExactValue',
      numberOfRepeats: 1,
    };

    this.steps[this.selectedStepIndex].sections.push(section);

    this.selectedSection = section;

    this.selectedType = 'section';

    this.normalizeSteps();
  }

  addFamilySection() {
    const currentStep = this.steps[this.selectedStepIndex];

    if (!currentStep) {
      alert('Please select or add a step first');
      return;
    }

    this.service.getSystemSection('FamilyMembers').subscribe({
      next: (res: any) => {
        console.log('✅ System Section Response:', res);

        const section = {
          title: res.title || 'Family Members',

          repeatable: true,
          repeatMode: 'AtLeastOne',
          numberOfRepeats: 3,

          deletable: true,

          system: true,

          intent: 'FamilyMembers',

          fields: (res.fields || []).map((f: any) => {
            // 🔥 الحفاظ على القواعد الأصلية (سواء جت في ruleSet أو validationRules)
            const originalRules = f.validationRules || f.ruleSet || {};
            const canOverride = f.validationRulesCanBeOverriden || {};
            const apiFieldType = f.type || f.fieldType;

            return {
              ...f,
              id: f.id,
              label: f.label,
              key: f.key,
              fieldType: apiFieldType,
              type: this.reverseMapFieldType(apiFieldType),
              system: true,

              // تخزين القواعد الأصلية للـ Payload
              validationRules: originalRules,
              canOverride: canOverride,

              // الربط مع الـ UI
              required: originalRules.isRequired ?? true,
              minLength: originalRules.minLength,
              maxLength: originalRules.maxLength,
              minValue: originalRules.minValue,
              maxValue: originalRules.maxValue,
              minDate: this.formatToInputDate(originalRules.minDate),
              maxDate: this.formatToInputDate(originalRules.maxDate),

              allowedValues: f.allowedValues || [],
            };
          }),
        };

        this.pushSectionToCurrentStep(section);
      },

      error: (err) => {
        console.error('❌ Fetch System Section Error, using fallback metadata:', err);

        /*
         * FALLBACK
         */
        const fallbackFields = this.getFallbackFamilyFields();
        const fallbackSection = {
          title: 'Family Members',
          repeatable: true,
          repeatMode: 'AtLeastOne',
          numberOfRepeats: 3,
          deletable: true,
          system: true,
          intent: 'FamilyMembers',
          fields: [
            {
              label: 'Full Name',
              key: 'sys_family_member_full_name',
              fieldType: 'Text',
              type: 'text',
              system: true,
              required: true,
              minLength: 2,
              maxLength: 100,
              validationRules: { ...fallbackFields[0].validationRules },
              canOverride: { ...fallbackFields[0].canOverride },
              allowedValues: []
            },
            {
              label: 'Date of Birth',
              key: 'sys_family_member_dob',
              fieldType: 'Date',
              type: 'date',
              system: true,
              required: true,
              minDate: this.formatToInputDate(fallbackFields[1].validationRules.minDate),
              maxDate: this.formatToInputDate(fallbackFields[1].validationRules.maxDate),
              validationRules: { ...fallbackFields[1].validationRules },
              canOverride: { ...fallbackFields[1].canOverride },
              allowedValues: []
            },
            {
              label: 'Relationship',
              key: 'sys_family_member_relationship',
              fieldType: 'Enum',
              type: 'enum',
              system: true,
              required: true,
              allowedValues: ['Father', 'Mother', 'Spouse', 'Son', 'Daughter'],
              validationRules: { ...fallbackFields[2].validationRules },
              canOverride: { ...fallbackFields[2].canOverride }
            },
          ],
        };

        this.pushSectionToCurrentStep(fallbackSection);
      },
    });
  }

  private pushSectionToCurrentStep(section: any) {
    const step = this.steps[this.selectedStepIndex];

    if (!step) return;

    step.sections.push(section);

    this.selectedSectionIndex = step.sections.length - 1;

    this.selectedSection = section;

    this.selectedType = 'section';

    this.normalizeSteps();
  }

  addField(type: string) {
    const section = this.steps[this.selectedStepIndex]?.sections[this.selectedSectionIndex];

    if (!section) {
      alert('Please select a section first');
      return;
    }

    const field = {
      label: 'New Field',

      key: 'field_' + Date.now() + '_' + Math.floor(Math.random() * 1000),

      type: type,

      required: false,
    };

    section.fields.push(field);

    this.selectedField = field;

    this.selectedType = 'field';

    this.normalizeSteps();
  }

  /* ================= SELECT ================= */

  selectStep(i: number) {
    this.selectedStepIndex = i;

    this.selectedStep = this.steps[i];

    this.selectedType = 'step';
  }

  selectSection(i: number) {
    this.selectedSectionIndex = i;

    this.selectedSection = this.steps[this.selectedStepIndex].sections[i];

    this.selectedStep = this.steps[this.selectedStepIndex];

    this.selectedType = 'section';
  }

  selectField(field: any) {
    this.selectedField = field;
    this.selectedType = 'field';

    if (this.isSystemField(field)) {
      // حماية إضافية
      console.warn('System field selected (read-only in backend)');
    }
  }

  /* ================= DELETE ================= */

  deleteStep(index: number) {
    this.steps.splice(index, 1);

    if (!this.steps.length) {
      this.addStep();
    }

    this.selectedType = null;

    this.normalizeSteps();
  }

  deleteSection(index: number) {
    this.steps[this.selectedStepIndex].sections.splice(index, 1);

    this.selectedType = null;

    this.normalizeSteps();
  }

  deleteField(field: any) {
    this.steps.forEach((step) => {
      step.sections.forEach((section: any) => {
        section.fields = section.fields.filter((f: any) => f !== field);
      });
    });

    this.selectedType = null;

    this.normalizeSteps();
  }

  /* ================= DRAG FIELD ================= */

  dragStartField(field: any) {
    this.dragField = field;
  }

  dropField(section: any) {
    if (!this.dragField) return;

    this.steps.forEach((step) => {
      step.sections.forEach((s: any) => {
        s.fields = s.fields.filter((f: any) => f !== this.dragField);
      });
    });

    section.fields.push(this.dragField);

    this.dragField = null;

    this.normalizeSteps();
  }

  /* ================= DRAG SECTION ================= */

  dragStartSection(section: any) {
    this.dragSection = section;
  }

  dropSection(step: any) {
    if (!this.dragSection) return;

    this.steps.forEach((s) => {
      s.sections = s.sections.filter((sec: any) => sec !== this.dragSection);
    });

    step.sections.push(this.dragSection);

    this.dragSection = null;

    this.normalizeSteps();
  }

  /* ================= ENUM ================= */

  addEnumValue() {
    if (!this.enumInput.trim()) return;

    if (!this.selectedField.allowedValues) {
      this.selectedField.allowedValues = [];
    }

    this.selectedField.allowedValues.push(this.enumInput.trim());

    this.enumInput = '';
  }

  removeEnumValue(index: number) {
    this.selectedField.allowedValues.splice(index, 1);
  }
}
