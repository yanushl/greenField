import { createElement } from "lwc";
import LeadCaptureForm from "c/leadCaptureForm";
import createLead from "@salesforce/apex/LeadCaptureController.createLead";

jest.mock(
  "@salesforce/apex/LeadCaptureController.createLead",
  () => ({
    default: jest.fn()
  }),
  { virtual: true }
);

jest.mock(
  "lightning/uiRecordApi",
  () => {
    return {
      getRecord: jest.fn()
    };
  },
  { virtual: true }
);

function flushPromises() {
  return Promise.resolve();
}

describe("c-lead-capture-form", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it("shows validation error when required fields are missing", async () => {
    const element = createElement("c-lead-capture-form", {
      is: LeadCaptureForm
    });
    document.body.appendChild(element);

    const submit = element.shadowRoot.querySelector(
      'lightning-button[data-id="submit"]'
    );
    submit.click();
    await flushPromises();

    expect(createLead).not.toHaveBeenCalled();
  });

  it("creates a lead and dispatches success toast", async () => {
    createLead.mockResolvedValue({
      leadId: "00Q000000000001AAA",
      leadName: "Ava Stone"
    });

    const element = createElement("c-lead-capture-form", {
      is: LeadCaptureForm
    });
    element.recordId = "001000000000001AAA";
    document.body.appendChild(element);

    const firstName = element.shadowRoot.querySelector(
      'lightning-input[data-id="firstName"]'
    );
    const lastName = element.shadowRoot.querySelector(
      'lightning-input[data-id="lastName"]'
    );
    const email = element.shadowRoot.querySelector(
      'lightning-input[data-id="email"]'
    );
    const company = element.shadowRoot.querySelector(
      'lightning-input[data-id="company"]'
    );
    const leadSource = element.shadowRoot.querySelector(
      'lightning-combobox[data-id="leadSource"]'
    );

    firstName.value = "Ava";
    firstName.dispatchEvent(
      new CustomEvent("change", { detail: { value: "Ava" } })
    );
    lastName.value = "Stone";
    lastName.dispatchEvent(
      new CustomEvent("change", { detail: { value: "Stone" } })
    );
    email.value = "ava.stone@example.com";
    email.dispatchEvent(
      new CustomEvent("change", { detail: { value: "ava.stone@example.com" } })
    );
    company.value = "Acme";
    company.dispatchEvent(
      new CustomEvent("change", { detail: { value: "Acme" } })
    );
    leadSource.value = "Web";
    leadSource.dispatchEvent(
      new CustomEvent("change", { detail: { value: "Web" } })
    );

    const handler = jest.fn();
    element.addEventListener("lightning__showtoast", handler);

    const submit = element.shadowRoot.querySelector(
      'lightning-button[data-id="submit"]'
    );
    submit.click();
    await flushPromises();

    expect(createLead).toHaveBeenCalled();
    expect(handler).toHaveBeenCalled();
    const evt = handler.mock.calls[0][0];
    expect(evt.detail.variant).toBe("success");
    expect(evt.detail.message).toContain("Ava Stone");
  });

  it("dispatches error toast on create failure", async () => {
    createLead.mockRejectedValue({
      body: { message: "Lead creation failed: no access" }
    });

    const element = createElement("c-lead-capture-form", {
      is: LeadCaptureForm
    });
    element.recordId = "001000000000001AAA";
    document.body.appendChild(element);

    const lastName = element.shadowRoot.querySelector(
      'lightning-input[data-id="lastName"]'
    );
    const email = element.shadowRoot.querySelector(
      'lightning-input[data-id="email"]'
    );
    const company = element.shadowRoot.querySelector(
      'lightning-input[data-id="company"]'
    );
    const leadSource = element.shadowRoot.querySelector(
      'lightning-combobox[data-id="leadSource"]'
    );

    lastName.value = "Stone";
    lastName.dispatchEvent(
      new CustomEvent("change", { detail: { value: "Stone" } })
    );
    email.value = "ava.stone@example.com";
    email.dispatchEvent(
      new CustomEvent("change", { detail: { value: "ava.stone@example.com" } })
    );
    company.value = "Acme";
    company.dispatchEvent(
      new CustomEvent("change", { detail: { value: "Acme" } })
    );
    leadSource.value = "Web";
    leadSource.dispatchEvent(
      new CustomEvent("change", { detail: { value: "Web" } })
    );

    const handler = jest.fn();
    element.addEventListener("lightning__showtoast", handler);

    const submit = element.shadowRoot.querySelector(
      'lightning-button[data-id="submit"]'
    );
    submit.click();
    await flushPromises();

    expect(handler).toHaveBeenCalled();
    const evt = handler.mock.calls[0][0];
    expect(evt.detail.variant).toBe("error");
  });
});
