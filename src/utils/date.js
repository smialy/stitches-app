export const formatDate = time => {
    const locale = 'pl-PL';
    const options = { timeStyle: "medium", dateStyle: "short" };
    return new Intl.DateTimeFormat(locale, options).format(new Date(time));
};