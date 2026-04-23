public with sharing class LeadCaptureController {
  public class LeadCaptureRequest {
    @AuraEnabled
    public Id accountId;
    @AuraEnabled
    public String firstName;
    @AuraEnabled
    public String lastName;
    @AuraEnabled
    public String email;
    @AuraEnabled
    public String phone;
    @AuraEnabled
    public String company;
    @AuraEnabled
    public String leadSource;
    @AuraEnabled
    public String notes;
  }

  public class LeadCaptureResponse {
    @AuraEnabled
    public Id leadId;
    @AuraEnabled
    public String leadName;

    public LeadCaptureResponse(Id leadId, String leadName) {
      this.leadId = leadId;
      this.leadName = leadName;
    }
  }

  @AuraEnabled
  public static LeadCaptureResponse createLead(String requestData) {
    LeadCaptureRequest req = (LeadCaptureRequest) JSON.deserialize(
      requestData,
      LeadCaptureRequest.class
    );
    validateRequest(req);

    try {
      Lead newLead = new Lead();
      newLead.FirstName = trimOrNull(req.firstName);
      newLead.LastName = req.lastName.trim();
      newLead.Email = req.email.trim();
      newLead.Phone = trimOrNull(req.phone);
      newLead.Company = req.company.trim();
      newLead.LeadSource = req.leadSource;
      newLead.Source_Account__c = req.accountId;
      newLead.Capture_Notes__c = trimOrNull(req.notes);

      insert newLead;

      return new LeadCaptureResponse(newLead.Id, getLeadDisplayName(newLead));
    } catch (DmlException ex) {
      throw new AuraHandledException(
        'Lead creation failed: ' + ex.getDmlMessage(0)
      );
    }
  }

  private static void validateRequest(LeadCaptureRequest requestData) {
    if (requestData == null) {
      throw new AuraHandledException('Lead capture request is required.');
    }

    if (requestData.accountId == null) {
      throw new AuraHandledException('Account context is required.');
    }

    if (String.isBlank(requestData.lastName)) {
      throw new AuraHandledException('Last Name is required.');
    }

    if (String.isBlank(requestData.email)) {
      throw new AuraHandledException('Email is required.');
    }

    if (!isValidEmail(requestData.email)) {
      throw new AuraHandledException('Email format is invalid.');
    }

    if (String.isBlank(requestData.company)) {
      throw new AuraHandledException('Company is required.');
    }

    if (String.isBlank(requestData.leadSource)) {
      throw new AuraHandledException('Lead Source is required.');
    }

    Set<String> allowedSources = new Set<String>{
      'Web',
      'Phone Inquiry',
      'Partner Referral',
      'Other'
    };
    if (!allowedSources.contains(requestData.leadSource)) {
      throw new AuraHandledException('Lead Source value is invalid.');
    }

    if (requestData.notes != null && requestData.notes.length() > 500) {
      throw new AuraHandledException('Notes cannot exceed 500 characters.');
    }
  }

  private static Boolean isValidEmail(String rawEmail) {
    if (String.isBlank(rawEmail)) {
      return false;
    }

    String email = rawEmail.trim();
    String emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$';
    return Pattern.matches(emailPattern, email);
  }

  private static String trimOrNull(String value) {
    return String.isBlank(value) ? null : value.trim();
  }

  private static String getLeadDisplayName(Lead leadRecord) {
    String first = String.isBlank(leadRecord.FirstName)
      ? ''
      : leadRecord.FirstName + ' ';
    return (first + leadRecord.LastName).trim();
  }
}
