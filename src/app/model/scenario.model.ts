export interface IScenario {
    id: number,
    scenario: string
}

export interface IScenarioResults {
    scenarioId: number,
    stateId: number,
    salesRegionId: number,
    countyId: string,
    planTypeId: string,
    snpTypeId: string,
    crossWalkId: string,
    bidId : string,
    isPartDPremium: boolean,
    isPartBGiveBack: boolean,
    isPlanCoverage: boolean,
    isHealthDeductible: boolean,
    isDrugDeductible: boolean,
    isAmbulance: boolean,
    isComprehensiveDental: boolean,
    isChiropractor: boolean,
    isMeal: boolean,
    isFitness: boolean,
    isOTC: boolean,
    isVision: boolean,
    isHearing: boolean,
    isEmergency: boolean,
    isTeleHealth: boolean,
    ishomeSupport: boolean,
    isHomeSaftey: boolean,
    isPers: boolean,
    premiumMin: number,
    premiumMax: number,
    enrollmentMin : number,
    enrollmentMax : number,
    enrollmentChangeMin : number,
    enrollmentChangeMax : number,
    moopMin : number,
    moopMax : number,
    enrollmentMonth: string,
    enrollmentFromMonth: string,
    enrollmentToMonth: string,
    isEnrollmentSelected : number,
    isSortBy : string,
    planBenefitGroups: string
}