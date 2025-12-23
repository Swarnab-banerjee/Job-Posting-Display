/**
 * @description       : Controller Class which fetches all Fields from Job Posting Object
 * @version           : 1.0.0
 * @type              : Controller
 * @author            : Swarnab Banerjee
 * @group             : 
 * @last modified on  : 12-23-2025
 * @last modified by  : Swarnab Banerjee
**/
public with sharing class JobPostingHelper {
    /**
    * @description : Gets all Fields and returns it to the LWC
    * @author Swarnab Banerjee | 12-15-2025 
    * @return List<Job_Posting__c> 
    **/
    @AuraEnabled(cacheable=true)
    public static List<Job_Posting__c> getAllJobPostings() {
        return [
            SELECT Id,
                    Position__c,
                    Position__r.Name,
                    Position__r.Location__c,
                    Position__r.Functional_Area__c,
                    Position__r.Open_Date__c,
                    Position__r.Total_Open_Positions__c,
                    Position__r.Status__c
            FROM Job_Posting__c
            WITH SECURITY_ENFORCED
            LIMIT 100
        ];
    }
}