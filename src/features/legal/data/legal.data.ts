import { LegalSection } from '../interfaces';

export const TYC_SECTIONS: LegalSection[] = [
    { id: 'acceptance', paragraphs: 2 },
    { id: 'service', paragraphs: 2 },
    { id: 'eligibility', paragraphs: 2 },
    { id: 'conduct', paragraphs: 1, items: 5 },
    { id: 'applications', paragraphs: 2, items: 4 },
    { id: 'tiers', paragraphs: 2 },
    { id: 'ip', paragraphs: 2 },
    { id: 'thirdParty', paragraphs: 1, items: 4 },
    { id: 'liability', paragraphs: 2 },
    { id: 'changes', paragraphs: 1 },
    { id: 'law', paragraphs: 2 },
];

export const PDP_SECTIONS: LegalSection[] = [
    { id: 'responsible', paragraphs: 2 },
    { id: 'dataCollected', paragraphs: 1, items: 4 },
    { id: 'purposes', paragraphs: 1, items: 4 },
    { id: 'legalBasis', paragraphs: 2 },
    { id: 'retention', paragraphs: 1, items: 3 },
    { id: 'sharing', paragraphs: 1, items: 3 },
    { id: 'cookies', paragraphs: 1, items: 3 },
    { id: 'minors', paragraphs: 2 },
    { id: 'rights', paragraphs: 1, items: 4 },
    { id: 'security', paragraphs: 2 },
    { id: 'changes', paragraphs: 1 },
    { id: 'contact', paragraphs: 2 },
];
