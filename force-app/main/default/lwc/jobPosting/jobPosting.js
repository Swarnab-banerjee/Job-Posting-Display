import { LightningElement, track } from 'lwc';
import getAllJobPostings from '@salesforce/apex/JobPostingHelper.getAllJobPostings';

export default class JobPosting extends LightningElement {
    @track postings = [];
    @track filteredPostings = [];
    @track departmentOptions = [];
    @track isLoading = true;
    @track error;

    selectedDepartment = 'All';

    columns = [
        { label: 'Job Title', fieldName: 'jobTitle', type: 'text' },
        { label: 'Department', fieldName: 'department', type: 'text' },
        { label: 'Location', fieldName: 'location', type: 'text' },
        { label: 'Open Positions', fieldName: 'openPositions', type: 'number' },
        { label: 'Posting Date', fieldName: 'postingDate', type: 'date' }
    ];

    connectedCallback() {
        this.loadPostings();
    }

    loadPostings() {
        this.isLoading = true;
        getAllJobPostings()
            .then(data => {
                console.log('data from Apex:', data);

                // Map data for datatable
                this.postings = data.map(jp => ({
                    Id: jp.Id,
                    jobTitle: jp.Position__r?.Name,
                    department: jp.Position__r?.Functional_Area__c,
                    location: jp.Position__r?.Location__c,
                    openPositions: jp.Position__r?.Total_Open_Positions__c || 0,
                    postingDate: jp.Position__r?.Open_Date__c
                }));

                console.log('Mapped postings:', this.postings);

                this.makeDepartmentOptions();
                this.applyFilter();
                this.isLoading = false;
            })
            .catch(error => {
                console.error('Error loading job postings:', error);
                this.error = error.body?.message || 'Error Loading Job Postings';
                this.isLoading = false;
            });
    }

    makeDepartmentOptions() {
        const departments = [...new Set(this.postings.map(p => p.department).filter(Boolean))];
        this.departmentOptions = [
            { label: 'All', value: 'All' },
            ...departments.map(d => ({ label: d, value: d }))
        ];
    }

    handleDepartmentChange(event) {
        this.selectedDepartment = event.detail.value;
        this.applyFilter();
    }

    applyFilter() {
        if (this.selectedDepartment === 'All') {
            this.filteredPostings = this.postings;
        } else {
            this.filteredPostings = this.postings.filter(p => p.department === this.selectedDepartment);
        }
    }
}
