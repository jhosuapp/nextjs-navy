import { useCallback, useDeferredValue, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useModalStore } from "@/shared/stores/modal.store";
import { useSkinStore } from "@/shared/stores/skin.store";
import { ITranslations } from "@/shared/interfaces/globals";
import { buildRanking, buildSummary, formatMonth, isMonthPeriod, previousMonth } from "../helpers";
import { RankedTester, TopTestersData, TopTestersPeriod } from "../interfaces";

/** Filas que se muestran de golpe en la lista (a partir del #4). */
const PAGE_SIZE = 20;

const subscribeNoop = (): (() => void) => () => {};

const formatUpdated = (generatedAt: string, locale: string, t: ITranslations): string => {
    const minutes = Math.round((new Date(generatedAt).getTime() - Date.now()) / 60000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const value = Math.abs(minutes) < 60 ? rtf.format(minutes, "minute") : rtf.format(Math.round(minutes / 60), "hour");
    return t("notes.updated", { value });
};

const useTopTestersController = (data: TopTestersData) => {
    const { t, i18n } = useTranslation("top-testers");
    const router = useRouter();
    const setShowModal = useModalStore((state) => state.setShowModal);
    const setSkin = useSkinStore((state) => state.setSkin);

    const [search, setSearch] = useState<string>("");
    const [onlyStaff, setOnlyStaff] = useState<boolean>(false);
    const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
    const deferredSearch = useDeferredValue(search);

    // El periodo vive en la URL (?period=2026-09 | all) para poder compartirlo.
    const queryPeriod = router.query.period;
    const period: TopTestersPeriod =
        queryPeriod === "all" || (isMonthPeriod(queryPeriod) && data.rankings[queryPeriod])
            ? (queryPeriod as TopTestersPeriod)
            : (data.currentMonth as TopTestersPeriod);

    const setPeriod = useCallback((next: TopTestersPeriod) => {
        setVisibleCount(PAGE_SIZE);
        // El mes en curso es el valor por defecto: se quita de la URL.
        const { period: _omit, ...rest } = router.query;
        const query = next === data.currentMonth ? rest : { ...rest, period: next };
        router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
    }, [router, data.currentMonth]);

    const ranking = useMemo<RankedTester[]>(() => {
        const entries = data.rankings[period] ?? [];
        const previous = period === "all" ? null : data.rankings[previousMonth(period)] ?? null;
        return buildRanking(entries, data.testers, previous);
    }, [data, period]);

    const summary = useMemo(() => buildSummary(data.rankings[period] ?? []), [data, period]);

    const retiredLabel = t("retired");
    const normalizedSearch = deferredSearch.trim().toLowerCase();
    const isFiltering = normalizedSearch.length > 0 || onlyStaff;

    const filtered = useMemo(() => {
        if (!isFiltering) return ranking.slice(3);
        return ranking.filter((tester) => {
            if (onlyStaff && !tester.role_name) return false;
            if (!normalizedSearch) return true;
            return (tester.nick ?? retiredLabel).toLowerCase().includes(normalizedSearch);
        });
    }, [ranking, isFiltering, onlyStaff, normalizedSearch, retiredLabel]);

    const onSearch = useCallback((value: string) => {
        setSearch(value);
        setVisibleCount(PAGE_SIZE);
    }, []);

    const onToggleStaff = useCallback(() => {
        setOnlyStaff((value) => !value);
        setVisibleCount(PAGE_SIZE);
    }, []);

    const onShowMore = useCallback(() => setVisibleCount((count) => count + PAGE_SIZE), []);

    // Abre el modal de jugador de la tierlist (skin 3D, tiers, puntos).
    const onOpenTester = useCallback((nick: string | null) => {
        if (!nick) return;
        setSkin(nick);
        setShowModal(true);
    }, [setSkin, setShowModal]);

    const locale = i18n.language;
    const periodOptions = useMemo(() => {
        const [current, previous, ...older] = data.months;
        return {
            current,
            previous: previous ?? null,
            older: older.map((month) => ({ value: month, label: formatMonth(month, locale) })),
        };
    }, [data.months, locale]);

    const periodLabel = period === "all" ? t("periods.all") : formatMonth(period, locale);

    // "Actualizado hace X" depende de la hora del cliente: solo se pinta tras
    // hidratar para no desajustar el HTML estático.
    const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
    const updatedLabel = isClient ? formatUpdated(data.generatedAt, locale, t) : null;

    return {
        t,
        period,
        periodLabel,
        periodOptions,
        setPeriod,
        isCurrentMonth: period === data.currentMonth,
        podium: ranking.slice(0, 3),
        list: filtered.slice(0, visibleCount),
        hasMore: filtered.length > visibleCount,
        totalResults: filtered.length,
        isEmptyPeriod: ranking.length === 0,
        isFiltering,
        summary,
        search,
        onSearch,
        onlyStaff,
        onToggleStaff,
        onShowMore,
        onOpenTester,
        updatedLabel,
        locale,
    };
};

export type TopTestersController = ReturnType<typeof useTopTestersController>;

export { useTopTestersController };
