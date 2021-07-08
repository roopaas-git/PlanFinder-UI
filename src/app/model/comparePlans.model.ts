export interface IComparePlans {
    bidId: string;
    stateId: number;
    counties: string;
    monthNumber : number;
    years : string;
}

export interface ICompareWithBasePlans {
    basePlan: string;
    comparePlan: string;
    stateId: number;
    counties: string;
    monthNumber : number;
    years : string;
}

export interface IComparePlansWithOrder {
    basePlan: string;
    comparePlan: string;
    premium: string;
    tpv: string;
    OOPC: string;
    enrollments: string;
    enrollmentGrowth: string;
    stateId: number;
    counties: string;
    monthNumber : number;
    years : string;
}