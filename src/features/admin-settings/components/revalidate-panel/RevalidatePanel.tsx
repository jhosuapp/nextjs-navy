import { memo, type JSX } from "react";
import { RefreshIcon } from "@/config/assets/icon/admin/AdminIcons";
import { AdminButton, Panel, StatusBadge } from "@/features/admin-core/components";
import { formatDateTime } from "@/features/admin-core/helpers";
import { ITranslations } from "@/shared/interfaces/globals";
import { RevalidateResult, RevalidateTarget } from "../../interfaces";
import styles from "./revalidatePanel.module.css";

type Props = {
    t: ITranslations;
    locale?: string;
    targets: RevalidateTarget[];
    lastRun: { at: string; results: RevalidateResult[] } | null;
    pendingTargets?: RevalidateTarget[];
    onRun: (targets: RevalidateTarget[]) => void;
};

const RevalidatePanel = memo(
    ({ t, locale, targets, lastRun, pendingTargets, onRun }: Props): JSX.Element => {
        const isRunning = pendingTargets !== undefined;
        const resultFor = (target: RevalidateTarget) => lastRun?.results.find((r) => r.target === target);

        return (
            <Panel
                title={t("settings.revalidate.title")}
                description={t("settings.revalidate.description")}
                icon={<RefreshIcon />}
                actions={
                    <AdminButton
                        size="sm"
                        icon={<RefreshIcon size={16} />}
                        isLoading={isRunning && pendingTargets.length === targets.length}
                        disabled={isRunning}
                        onClick={() => onRun(targets)}
                    >
                        {t("settings.revalidate.all")}
                    </AdminButton>
                }
            >
                <ul className={styles.revalidate__list}>
                    {targets.map((target) => {
                        const result = resultFor(target);
                        return (
                            <li key={target} className={styles.revalidate__item}>
                                <div className={styles.revalidate__text}>
                                    <span className={styles.revalidate__name}>{t(`settings.revalidate.targets.${target}.name`)}</span>
                                    <span className={styles.revalidate__hint}>{t(`settings.revalidate.targets.${target}.hint`)}</span>
                                </div>
                                <div className={styles.revalidate__side}>
                                    {result && (
                                        <StatusBadge tone={result.ok ? "success" : "danger"}>
                                            {result.ok ? t("settings.revalidate.ok") : t("settings.revalidate.failed")}
                                        </StatusBadge>
                                    )}
                                    <AdminButton
                                        variant="ghost"
                                        size="sm"
                                        isLoading={isRunning && pendingTargets.length === 1 && pendingTargets[0] === target}
                                        disabled={isRunning}
                                        onClick={() => onRun([target])}
                                    >
                                        {t("settings.revalidate.run")}
                                    </AdminButton>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                {lastRun && (
                    <p className={styles.revalidate__meta}>
                        {t("settings.revalidate.lastRun", { date: formatDateTime(lastRun.at, locale) })}
                    </p>
                )}
            </Panel>
        );
    }
);

RevalidatePanel.displayName = "RevalidatePanel";

export { RevalidatePanel };
