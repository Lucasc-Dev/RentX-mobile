import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { convert } from '../utils/ConvertMonth';

interface PeriodContextData {
    period: Period;
    definePeriod(period: Period): void;
    formattedStartDate: string | undefined;
    formattedEndDate: string | undefined;
}

interface Period {
    start_date: Date;
    end_date: Date;
}

const PeriodContext = createContext<PeriodContextData>({} as PeriodContextData);

export const PeriodProvider: React.FC = ({ children }) => {
    const [period, setPeriod] = useState<Period>({} as Period);

    const definePeriod = useCallback((period: Period) => {
        setPeriod(period);
    }, []);

    const formattedStartDate = useMemo(() => {
        if (period.start_date) {
            const month = convert(period.start_date.getMonth());
        
            return `${period.start_date.getDate()} ${month} ${period.start_date.getFullYear()}`;
        }
    }, [period]);

    const formattedEndDate = useMemo(() => {
        if (period.end_date) {
            const month = convert(period.end_date.getMonth());
        
            return `${period.end_date.getDate()} ${month} ${period.end_date.getFullYear()}`;
        }
    }, [period]);

    return (
        <PeriodContext.Provider value={{ period, definePeriod, formattedStartDate, formattedEndDate }}>
            {children}
        </PeriodContext.Provider>
    );
};

export function usePeriod(): PeriodContextData {
    const context = useContext(PeriodContext);

    return context;
}