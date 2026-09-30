import { memo, type JSX } from "react";
import Image from "next/image";
import { InputField } from "@/shared/components/input-field/InputField";
import { CustomSelect } from "@/shared/components/custom-select/CustomSelect";
import { TopTestersController } from "../../hooks";
import { TopTestersPeriod } from "../../interfaces";

import styles from './periodFilters.module.css';
import iconSearch from '@/config/assets/svg/icon-search.svg';

type Props = Pick<
    TopTestersController,
    't' | 'period' | 'periodOptions' | 'setPeriod' | 'search' | 'onSearch' | 'onlyStaff' | 'onToggleStaff'
>;

const PeriodFilters = memo(({ t, period, periodOptions, setPeriod, search, onSearch, onlyStaff, onToggleStaff }: Props): JSX.Element => {
    const tabs: Array<{ value: TopTestersPeriod; label: string }> = [
        { value: periodOptions.current as TopTestersPeriod, label: t('periods.current') },
        ...(periodOptions.previous ? [{ value: periodOptions.previous as TopTestersPeriod, label: t('periods.previous') }] : []),
        { value: 'all', label: t('periods.all') },
    ];
    const isOlderMonth = periodOptions.older.some((option) => option.value === period);

    return (
        <div className={ styles.periodFilters }>
            <div className={ styles.periodFilters__periods }>
                <div className={ styles.periodFilters__tabs } role="tablist" aria-label={ t('periods.label') }>
                    {tabs.map((tab) => (
                        <button
                            key={ tab.value }
                            type="button"
                            role="tab"
                            aria-selected={ period === tab.value }
                            className={ `${styles.periodFilters__tab} ${period === tab.value ? styles.periodFilters__tab__active : ''}` }
                            onClick={ () => setPeriod(tab.value) }
                        >
                            { tab.label }
                        </button>
                    ))}
                </div>
                {periodOptions.older.length > 0 && (
                    <CustomSelect
                        className={ styles.periodFilters__select }
                        label={ t('periods.more') }
                        placeholder={ t('periods.more') }
                        options={ periodOptions.older as Array<{ value: TopTestersPeriod; label: string }> }
                        value={ isOlderMonth ? period : null }
                        onChange={ setPeriod }
                    />
                )}
            </div>
            <div className={ styles.periodFilters__refine }>
                <button
                    type="button"
                    aria-pressed={ onlyStaff }
                    className={ `${styles.periodFilters__toggle} ${onlyStaff ? styles.periodFilters__toggle__active : ''}` }
                    onClick={ onToggleStaff }
                >
                    <span className={ styles.periodFilters__toggle__dot } aria-hidden="true" />
                    { t('filters.onlyStaff') }
                </button>
                <div className={ styles.periodFilters__search }>
                    <Image src={ iconSearch } alt="" width={16} height={16} aria-hidden="true" />
                    <InputField
                        type="search"
                        value={ search }
                        placeholder={ t('filters.search') }
                        aria-label={ t('filters.search') }
                        onChange={ (e) => onSearch(e.target.value) }
                    />
                </div>
            </div>
        </div>
    );
});

PeriodFilters.displayName = 'PeriodFilters';

export { PeriodFilters }
