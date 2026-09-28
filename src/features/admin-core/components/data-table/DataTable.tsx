import { memo, type JSX, type ReactNode } from "react";
import { cn } from "@/shared/helpers/cn";
import { Spinner } from "@/shared/components/spinner/Spinner";
import { EmptyState } from "../empty-state/EmptyState";
import styles from "./dataTable.module.css";

export type DataTableColumn<T> = {
    key: string;
    header: string;
    render: (row: T) => ReactNode;
    /** Clases extra para la celda (ancho, alineación…). */
    className?: string;
    /** Ocultar la columna en pantallas pequeñas. */
    hideOnMobile?: boolean;
};

type Props<T> = {
    caption: string;
    columns: DataTableColumn<T>[];
    rows: T[];
    getRowKey: (row: T) => string | number;
    isLoading?: boolean;
    /** Refetch en segundo plano: atenúa la tabla sin vaciarla. */
    isFetching?: boolean;
    emptyText: string;
    rowClassName?: (row: T) => string | undefined;
};

const DataTableBase = <T,>({
    caption,
    columns,
    rows,
    getRowKey,
    isLoading = false,
    isFetching = false,
    emptyText,
    rowClassName,
}: Props<T>): JSX.Element => {
    if (isLoading) {
        return (
            <div className={styles.dataTable__state}>
                <Spinner />
            </div>
        );
    }

    if (rows.length === 0) {
        return <EmptyState text={emptyText} />;
    }

    return (
        <div className={cn(styles.dataTable, isFetching && styles.dataTable__fetching)} aria-busy={isFetching}>
            <table className={styles.dataTable__table}>
                <caption className="sr-only">{caption}</caption>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={cn(
                                    styles.dataTable__th,
                                    column.hideOnMobile && styles.dataTable__hideMobile,
                                    column.className
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={getRowKey(row)} className={cn(styles.dataTable__row, rowClassName?.(row))}>
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={cn(
                                        styles.dataTable__td,
                                        column.hideOnMobile && styles.dataTable__hideMobile,
                                        column.className
                                    )}
                                >
                                    {column.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DataTable = memo(DataTableBase) as typeof DataTableBase & { displayName?: string };
DataTable.displayName = "DataTable";

export { DataTable };
