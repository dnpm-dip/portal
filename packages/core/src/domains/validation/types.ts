export type ValidationReportIssue = {
    severity: 'warning' | 'error' | 'info',
    message: string,
    path: string
};

export type ValidationReport = {
    issues: ValidationReportIssue[],
    createdAt: string,
    patient: string,
};

export type ValidationReportInfo = {
    createdAt: string,
    issues: {
        warning: number,
        error: number,
        info: number
    },
    id: string,
};
