import type { JSX } from "react";
import { motion } from "framer-motion";
import { Container } from "@/shared/components/container/Container";
import { Button } from "@/shared/components/button/Button";
import { Spinner } from "@/shared/components/spinner/Spinner";
import { Feedback } from "@/shared/components/feedback/Feedback";
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";
import { useAdminApplicationsController } from "../hooks";
import { LoginForm } from "../components/login-form/LoginForm";
import { ApplicationCard } from "../components/application-card/ApplicationCard";
import { Pagination } from "../components/pagination/Pagination";
import { ApplicationKindFilter } from "../interfaces";
import styles from "./adminApplications.module.css";

const FILTERS: ApplicationKindFilter[] = ["all", "helper", "tester"];

const AdminApplicationsView = (): JSX.Element => {
    const {
        t,
        isAuthenticated,
        sessionLoading,
        username,
        control,
        errors,
        handleSubmit,
        onLogin,
        isLoggingIn,
        onLogout,
        isLoggingOut,
        applications,
        total,
        page,
        totalPages,
        isListLoading,
        isListFetching,
        goToNextPage,
        goToPrevPage,
        kind,
        setKind,
        onUpdateStatus,
        updatingKey,
    } = useAdminApplicationsController();

    if (sessionLoading) {
        return (
            <Container className="!mt-5 lg:!mt-10" isFirst isLast>
                <div className={styles.center}>
                    <Spinner />
                </div>
            </Container>
        );
    }

    if (!isAuthenticated) {
        return (
            <Container className="!mt-5 lg:!mt-10" isFirst isLast>
                <LoginForm
                    t={t}
                    control={control}
                    errors={errors}
                    onSubmit={handleSubmit(onLogin)}
                    isLoading={isLoggingIn}
                />
            </Container>
        );
    }

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <motion.header className={styles.header} {...fadeUpMotion(0.57, 0)}>
                <div>
                    <h1 className={styles.header__title}>{t("list.title")}</h1>
                    <p className={styles.header__subtitle}>
                        {t("list.subtitle", { username, total })}
                    </p>
                </div>
                <Button
                    type="button"
                    text={t("list.logout")}
                    style="fit"
                    onClick={onLogout}
                    isLoad={isLoggingOut}
                    isSmall
                />
            </motion.header>

            <div className={styles.filters} role="group" aria-label={t("filter.label")}>
                {FILTERS.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`${styles.filter} ${kind === option ? styles.filter__active : ""}`}
                        onClick={() => setKind(option)}
                        aria-pressed={kind === option}
                    >
                        {t(`filter.${option}`)}
                    </button>
                ))}
            </div>

            {isListLoading ? (
                <div className={styles.center}>
                    <Spinner />
                </div>
            ) : applications.length === 0 ? (
                <Feedback texFeedback={t("list.empty")} />
            ) : (
                <>
                    <div className={styles.list}>
                        {applications.map((application) => (
                            <motion.div
                                layout
                                key={`${application.kind}-${application.id}`}
                            >
                                <ApplicationCard
                                    t={t}
                                    data={application}
                                    onUpdateStatus={onUpdateStatus}
                                    isUpdating={
                                        updatingKey ===
                                        `${application.kind}-${application.id}`
                                    }
                                />
                            </motion.div>
                        ))}
                    </div>

                    <Pagination
                        t={t}
                        page={page}
                        totalPages={totalPages}
                        isFetching={isListFetching}
                        onPrev={goToPrevPage}
                        onNext={goToNextPage}
                    />
                </>
            )}
        </Container>
    );
};

export { AdminApplicationsView };
