export interface IPlans {
    bidId: string;
    planName: string;
    richplans: number;
    leanPlans: number;
    winningPlans: number;
    premiumCD: number;
    partD: number;
    partBGiveBack: number;
    planCoverage: string;
    sbAmbulance: string;
    sbWorldWideEmergency: string;
    sbHearing: string;
    healthDeductible: number;
    anualDrugDeductible: number;
    moop: number;
    sbVision: string;
    starRating: string;
    tpv: number;
    oopc: number;
    pcp: string;
    specialist: string;
    inPatientAcute: string;
    sbinPatient: string;
    octCoverage: string;
    sbOTC: number;
    sbCompDental: string;
    compDentalCoverage: string;
    sbChiropractor: number;
    sbMeal: number;
    sbFitness: string;
    emergencyCare: string;
    opHospital: string;
    sbTeleHealth: string;
    sbHomeSupport: string;
    sbHomeSaftey: string;
    sbPers: string;
    enrollment: number;
    enrollment1: number;
}


export interface IPlansList {
    field: string;
    header: string;
}