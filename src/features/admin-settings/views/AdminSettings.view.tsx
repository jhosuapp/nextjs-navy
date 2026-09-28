import type { JSX } from "react";
import { useRouter } from "next/router";
import { PageHeader } from "@/features/admin-core/components";
import { REVALIDATE_TARGETS, useAdminSettingsController } from "../hooks";
import { AuditPanel, CachePanel, PasswordPanel, RevalidatePanel } from "../components";
import styles from "./adminSettings.module.css";

const AdminSettingsView = (): JSX.Element => {
    const { locale } = useRouter();
    const { t, isFounder, revalidate, cache, password, audit } = useAdminSettingsController();

    return (
        <>
            <PageHeader title={t("settings.title")} description={t("settings.description")} />

            <div className={styles.settingsGrid}>
                <RevalidatePanel
                    t={t}
                    locale={locale}
                    targets={REVALIDATE_TARGETS}
                    lastRun={revalidate.lastRun}
                    pendingTargets={revalidate.pendingTargets}
                    onRun={revalidate.run}
                />
                <CachePanel t={t} cache={cache} />
                <PasswordPanel t={t} password={password} />
                {isFounder && (
                    <div className={styles.settingsGrid__full}>
                        <AuditPanel t={t} locale={locale} audit={audit} />
                    </div>
                )}
            </div>
        </>
    );
};

export { AdminSettingsView };
