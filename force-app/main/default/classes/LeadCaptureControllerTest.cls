@IsTest
private class LeadCaptureControllerTest {
  private static Account createAccount() {
    Account acct = new Account(Name = 'Acme Test Account');
    insert acct;
    return acct;
  }

  @IsTest
  static void createLead_success_setsFieldsAndReturnsName() {
    Account acct = createAccount();

    LeadCaptureController.LeadCaptureRequest req = new LeadCaptureController.LeadCaptureRequest();
    req.accountId = acct.Id;
    req.firstName = 'Ava';
    req.lastName = 'Stone';
    req.email = 'ava.stone@example.com';
    req.phone = '123-456-7890';
    req.company = acct.Name;
    req.leadSource = 'Web';
    req.notes = 'Captured from account page';

    Test.startTest();
    LeadCaptureController.LeadCaptureResponse result = LeadCaptureController.createLead(
      req
    );
    Test.stopTest();

    System.assertNotEquals(null, result);
    System.assertNotEquals(null, result.leadId);
    System.assertEquals('Ava Stone', result.leadName);

    Lead created = [
      SELECT
        FirstName,
        LastName,
        Email,
        Company,
        LeadSource,
        Source_Account__c,
        Capture_Notes__c
      FROM Lead
      WHERE Id = :result.leadId
      LIMIT 1
    ];

    System.assertEquals('Ava', created.FirstName);
    System.assertEquals('Stone', created.LastName);
    System.assertEquals('ava.stone@example.com', created.Email);
    System.assertEquals(acct.Name, created.Company);
    System.assertEquals('Web', created.LeadSource);
    System.assertEquals(acct.Id, created.Source_Account__c);
    System.assertEquals('Captured from account page', created.Capture_Notes__c);
  }

  @IsTest
  static void createLead_failsOnInvalidEmail() {
    Account acct = createAccount();

    LeadCaptureController.LeadCaptureRequest req = new LeadCaptureController.LeadCaptureRequest();
    req.accountId = acct.Id;
    req.lastName = 'Stone';
    req.email = 'bad-email';
    req.company = acct.Name;
    req.leadSource = 'Web';

    try {
      LeadCaptureController.createLead(req);
      System.assert(false, 'Expected AuraHandledException');
    } catch (AuraHandledException ex) {
      System.assertNotEquals(null, ex.getMessage());
    }
  }

  @IsTest
  static void createLead_failsOnNotesLimit() {
    Account acct = createAccount();

    LeadCaptureController.LeadCaptureRequest req = new LeadCaptureController.LeadCaptureRequest();
    req.accountId = acct.Id;
    req.lastName = 'Stone';
    req.email = 'valid@example.com';
    req.company = acct.Name;
    req.leadSource = 'Web';
    req.notes = ''.leftPad(501, 'A');

    try {
      LeadCaptureController.createLead(req);
      System.assert(false, 'Expected AuraHandledException');
    } catch (AuraHandledException ex) {
      System.assertNotEquals(null, ex.getMessage());
    }
  }

  @IsTest
  static void createLead_failsOnInvalidLeadSource() {
    Account acct = createAccount();

    LeadCaptureController.LeadCaptureRequest req = new LeadCaptureController.LeadCaptureRequest();
    req.accountId = acct.Id;
    req.lastName = 'Stone';
    req.email = 'valid@example.com';
    req.company = acct.Name;
    req.leadSource = 'Email Campaign';

    try {
      LeadCaptureController.createLead(req);
      System.assert(false, 'Expected AuraHandledException');
    } catch (AuraHandledException ex) {
      System.assertNotEquals(null, ex.getMessage());
    }
  }
}
