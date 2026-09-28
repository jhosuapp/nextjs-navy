import { memo, type JSX } from "react";
import { DatabaseIcon, RefreshIcon } from "@/config/assets/icon/admin/AdminIcons";
import { AdminButton, ConfirmDialog, IconButton, Panel } from "@/features/admin-core/components";
import { Spinner } from "@/shared/components/spinner/Spinner";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminSettingsController } from "../../hooks";
import styles from "./cachePanel.module.css";

type Props = {
    t: ITranslations;
    cache: AdminSettingsController["cache"];
};

const CachePanel = memo(
    ({ t, cache }: Props): JSX.Element => (
        <Panel
            title={t("settings.cache.title")}
            description={t("settings.cache.description")}
            icon={<DatabaseIcon />}
            actions={
                <>
                    <IconButton
                        label={t("settings.cache.refresh")}
                        icon={<RefreshIcon size={18} />}
                        onClick={cache.refresh}
                        disabled={cache.isFetching}
                    />
                    <AdminButton variant="ghost" size="sm" onClick={cache.purgeExpired} disabled={cache.isPurging}>
                        {t("settings.cache.purgeExpired")}
                    </AdminButton>
                </>
            }
        >
            {cache.isLoading ? (
                <div className={styles.cache__center}>
                    <Spinner />
                </div>
            ) : (
                <ul className={styles.cache__grid}>
                    {cache.groups.map((group) => (
                        <li key={group.group} className={styles.cache__item}>
                            <div className={styles.cache__head}>
                                <span className={styles.cache__name}>{t(`settings.cache.groups.${group.group}.name`)}</span>
                                <AdminButton
                                    variant="danger"
                                    size="sm"
                                    disabled={cache.isPurging || group.total === 0}
                                    onClick={() => cache.askPurge(group.group)}
                                >
                                    {t("settings.cache.purge")}
                                </AdminButton>
                            </div>
                            <span className={styles.cache__hint}>{t(`settings.cache.groups.${group.group}.hint`)}</span>
                            <dl className={styles.cache__stats}>
                                <div>
                                    <dt>{t("settings.cache.total")}</dt>
                                    <dd>{group.total}</dd>
                                </div>
                                <div>
                                    <dt>{t("settings.cache.expired")}</dt>
                                    <dd>{group.expired}</dd>
                                </div>
                            </dl>
                        </li>
                    ))}
                </ul>
            )}

            <p className={styles.cache__note}>{t("settings.cache.protectedNote")}</p>

            <ConfirmDialog
                isOpen={cache.confirming !== null}
                title={t("settings.cache.confirmTitle")}
                description={t("settings.cache.confirmDescription", {
                    group: cache.confirming ? t(`settings.cache.groups.${cache.confirming}.name`) : "",
                })}
                confirmLabel={t("settings.cache.purge")}
                cancelLabel={t("common.cancel")}
                closeLabel={t("common.close")}
                isLoading={cache.isPurging}
                onConfirm={() => cache.confirming && cache.purgeGroup(cache.confirming)}
                onCancel={cache.cancelPurge}
            />
        </Panel>
    )
);

CachePanel.displayName = "CachePanel";

export { CachePanel };
