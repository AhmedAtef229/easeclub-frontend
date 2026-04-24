import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-template-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-template-modal.component.html',
})
export class CreateTemplateModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  templateName = 'Standard Membership Application';

  selectedStepIndex = 0;
  selectedSectionIndex = 0;

  selectedStep: any = null;
  selectedSection: any = null;
  selectedField: any = null;

  selectedType: 'step' | 'section' | 'field' | null = null;

  dragField: any = null;
  dragSection: any = null;

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
    { label: 'Short Text', type: 'text', icon: 'fa-solid fa-font' },
    { label: 'Number', type: 'number', icon: 'fa-solid fa-hashtag' },
    { label: 'Date', type: 'date', icon: 'fa-solid fa-calendar' },
    { label: 'File', type: 'file', icon: 'fa-solid fa-file' },
    { label: 'Enum', type: 'enum', icon: 'fa-solid fa-list' },
  ];

  constructor() {
    this.normalizeSteps();
  }

  closeModal() {
    this.close.emit();
  }

  /* ================= SAVE ================= */

  save() {
    const payload = {
      name: this.templateName,
      steps: this.mapSteps(),
    };

    this.submitForm.emit(payload);
    this.closeModal();
  }

  /* ================= MAPPER ================= */

mapSteps() {
  return this.steps.map((step: any) => ({
    id: step.id ?? null,
    title: step.title,

    sections: (step.sections || []).map((section: any) => ({
      id: section.id ?? null,
      title: section.title,

      intent: section.system ? 'FamilyMembers' : 'General',

      repeatRule: {
        mode: section.repeatable ? 'AtLeastOne' : 'ExactValue',
        numberOfRepeats: section.repeatable ? 5 : 1,
      },

      fields: (section.fields || []).map((field: any) => ({
        id: field.id ?? null,
        key: field.key,
        label: field.label,

        fieldType: this.mapFieldType(field.type),

        validationRules: {
          isRequired: field.required ?? false,
          minLength: field.minLength ?? 0,
          maxLength: field.maxLength ?? 0,
          minValue: field.minValue ?? 0,
          maxValue: field.maxValue ?? 0,
          minDate: field.minDate ?? null,
          maxDate: field.maxDate ?? null,
        },

        allowedValues: field.allowedValues ?? [],
      })),
    })),
  }));
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
    };

    this.steps[this.selectedStepIndex].sections.push(section);

    this.selectedSection = section;
    this.selectedType = 'section';

    this.normalizeSteps();
  }

  addFamilySection() {
    const section = {
      title: 'Family Members',
      repeatable: true,
      deletable: true,
      system: true,
      fields: [
        {
          label: 'Full Name',
          key: 'sys_family_full_name',
          type: 'text',
          required: true,
        },
        {
          label: 'Date of Birth',
          key: 'sys_family_dob',
          type: 'date',
          required: true,
        },
        {
          label: 'Relationship',
          key: 'sys_family_relation',
          type: 'enum',
          required: true,
          allowedValues: ['Father', 'Mother', 'Spouse', 'Son', 'Daughter'],
        },
      ],
    };

    this.steps[this.selectedStepIndex].sections.push(section);

    this.selectedSection = section;
    this.selectedType = 'section';

    this.normalizeSteps();
  }

  addField(type: string) {
    const section =
      this.steps[this.selectedStepIndex]?.sections[this.selectedSectionIndex];

    if (!section) return;

    const field = {
      label: 'New Field',
      key: 'field_' + Date.now(),
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
      s.sections = s.sections.filter(
        (sec: any) => sec !== this.dragSection
      );
    });

    step.sections.push(this.dragSection);
    this.dragSection = null;

    this.normalizeSteps();
  }

  /* ================= ENUM ================= */

  enumInput: string = '';

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
