import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import { formatDate } from "../../utils/date";
import { useDatabase } from "../../hooks/db";
import Icons from "../../ui/Icons";
import Page from "../../ui/Page";
import Button from "../../ui/Button";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const db = useDatabase();
    useEffect(() => {
        setLoading(true);
        db.order.all().then(orders => {
            setOrders(orders);
            setLoading(false);
        });
    }, []);

    const addOrderHandler = () => {
        db.order.create().then(order => {
            setOrders(orders.concat([order]));
        });
    };
    const removeHandler = ({ id }) => {
        db.order.remove(id).then(() => {
            setOrders(orders.filter(order => order.id !== id));
        });
    };
    const { Header, Body } = Page;
    return (
        <Page name="orders-page">
            <Header>
                Orders
                <Header.Action
                    label="New order"
                    icon={<Icons.AddCicle />}
                    onClick={addOrderHandler}
                    primary
                />
            </Header>
            <Body>
                <div className="order-list">
                    {loading && "Loading..."}
                    {!loading &&
                        orders.map(order => <Order order={order} onRemove={removeHandler} />)}
                </div>
            </Body>
        </Page>
    );
}

function Order({ order, onRemove }) {
    const { id, status, createdAt } = order;
    const url = `/order/${id}`;
    return (
        <div class="order" data-id={id}>
            <div class="body" onClick={() => route(url)}>
                <div class="status">Status: {status}</div>
                <div class="status">Created: {formatDate(createdAt)}</div>
            </div>
            <div class="actions">
                <Button onClick={() => onRemove(order)} outline>
                    <Icons.Delete />
                    Remove
                </Button>
            </div>
        </div>
    );
}
