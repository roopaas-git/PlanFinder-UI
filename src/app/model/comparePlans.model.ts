export interface IComparePlans {
    bidId: string;
}

export interface ICompareWithBasePlans {
    basePlan: string;
    comparePlan: string;
}

export interface IComparePlansWithOrder {
    basePlan: string;
    comparePlan: string;
    premium: string;
    tpv: string;
    OOPC: string;
    enrollmentGrowth: string;
}