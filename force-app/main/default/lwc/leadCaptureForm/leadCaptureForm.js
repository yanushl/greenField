import { api, LightningElement, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord } from "lightning/uiRecordApi";
import createLead from "@salesforce/apex/LeadCaptureController.createLead";

import ACCOUNT_NAME_FIELD from "@salesforce/schema/Account.Name";

const LEAD_SOURCE_OPTIONS = [
  { label: "Web", value: "Web" },
  { label: "Phone Inquiry", value: "Phone Inquiry" },
  { label: "Partner Referral", value: "Partner Referral" },
  { label: "Other", value: "Other" }
];

const MAX_NOTES_LENGTH = 500;

export default class LeadCaptureForm extends LightningElement {
  @api recordId;
  @track formData = this.getInitialFormData();
  @track isSaving = false;

  accountName = "";

  @wire(getRecord, { recordId: "$recordId", fields: [ACCOUNT_NAME_FIELD] })
  accountRecordWire({ data, error }) {
    if (data) {
      this.accountName = data.fields.Name.value;
      this.formData.company = this.accountName;
    } else if (error) {
      this.dispatchToast("Error", "Unable to load account details.", "error");
    }
  }

  get leadSourceOptions() {
    return LEAD_SOURCE_OPTIONS;
  }

  get notesRemaining() {
    return MAX_NOTES_LENGTH - (this.formData.notes?.length || 0);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.formData = { ...this.formData, [name]: value };
  }

  async handleSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;
    const leadParam = {
      accountId: this.recordId,
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      phone: this.formData.phone,
      company: this.formData.company,
      leadSource: this.formData.leadSource,
      notes: this.formData.notes
    };
    try {
      const response = await createLead({
        requestData: JSON.stringify(leadParam)
      });

      this.dispatchToast(
        "Success",
        `Lead ${response.leadName} was created.`,
        "success"
      );
      this.formData = this.getInitialFormData();
      this.formData.company = this.accountName;
    } catch (error) {
      const message =
        error?.body?.message ||
        error?.message ||
        "Lead creation failed. Please try again.";
      this.dispatchToast("Error", message, "error");
    } finally {
      this.isSaving = false;
    }
  }

  validateForm() {
    const inputs = [
      ...this.template.querySelectorAll(
        "lightning-input, lightning-textarea, lightning-combobox"
      )
    ];
    inputs.forEach((input) => {
      if (typeof input.reportValidity === "function") {
        input.reportValidity();
      }
    });

    if (
      !this.formData.lastName ||
      !this.formData.email ||
      !this.formData.company ||
      !this.formData.leadSource
    ) {
      this.dispatchToast(
        "Error",
        "Please complete all required fields.",
        "error"
      );
      return false;
    }

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(this.formData.email)) {
      this.dispatchToast("Error", "Email format is invalid.", "error");
      return false;
    }

    if ((this.formData.notes || "").length > MAX_NOTES_LENGTH) {
      this.dispatchToast(
        "Error",
        `Notes cannot exceed ${MAX_NOTES_LENGTH} characters.`,
        "error"
      );
      return false;
    }

    return true;
  }

  dispatchToast(title, message, variant) {
    this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
  }

  getInitialFormData() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      leadSource: "",
      notes: ""
    };
  }
}
