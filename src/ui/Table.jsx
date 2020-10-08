import { h } from "preact";

export function Table({ options, data }) {
    return (
        <table class="s-table">
            <Header options={options} data={data} />
            <Body options={options} data={data} />
            <Footer options={options} data={data} />
        </table>
    );
}
function renderCell(cell, data) {
    if (cell !== null) {
        if (typeof cell === "string") {
            return cell;
        }
        if (typeof cell.render === "function") {
            return cell.render(data);
        }
        if (cell) {
            return cell;
        }
    }
    return "";
}
function renderHeaderCell(column) {
    return column.label ? column.label : " ";
}

const Formater = {
    formatCell(column, value, row) {
        if (column && typeof column.format === "function") {
            return column.format(value, row);
        }
        return value;
    },
    getCellClassName(column) {
        const buff = [];
        if (column && column.styles) {
            const styles = column.styles;
            if (styles.align) {
                buff.push(styles.align);
            }
        }
        return buff.join(" ");
    },
    getCellStyle(column) {
        const buff = {};
        if (column && column.styles) {
            const styles = column.styles;
            if (styles.width) {
                buff.width = styles.width;
            }
        }
        return buff;
    },
    isHidden(column) {
        return !!column.hidden;
    },
};
function findColSpan({ columns }, data) {
    if (columns && columns.length) {
        return columns.length;
    }
    if (columns) {
        return columns.reduce((sum, column) => sum + (column && column.hidden ? 0 : 1), 0);
    }
    if (data && data.length) {
        return data[0].length;
    }
    return 0;
}

function Header({ options }) {
    const { columns } = options;
    return (
        <thead>
            <tr>
                {columns.map((column, i) =>
                    Formater.isHidden(column) ? null : (
                        <th key={i} style={Formater.getCellStyle(column)}>
                            {renderHeaderCell(column)}
                        </th>
                    )
                )}
            </tr>
        </thead>
    );
}

function Body({ options, data }) {
    const { columns } = options;
    return (
        <tbody>
            {data && data.length ? (
                data.map((row, ri) => (
                    <tr key={ri}>
                        {columns.map((column, i) =>
                            Formater.isHidden(column) ? null : (
                                <td key={i} style={Formater.getCellStyle(column)}>
                                    {Formater.formatCell(column, row[column.name], row)}
                                </td>
                            )
                        )}
                    </tr>
                ))
            ) : (
                <tr>
                    <td className="left" colSpan={findColSpan(options)}>
                        {options.empty || "No data"}
                    </td>
                </tr>
            )}
        </tbody>
    );
}

function Footer({ options, data }) {
    const { footer, columns } = options;
    if (Array.isArray(footer) && footer.length) {
        return (
            <tfoot>
                <tr>
                    {footer.map((cell, i) =>
                        formater.isHidden(columns[i]) ? null : (
                            <td key={i} style={formater.getCellStyle(columns[i])}>
                                {renderCell(cell)}
                            </td>
                        )
                    )}
                </tr>
            </tfoot>
        );
    }
    return null;
}
