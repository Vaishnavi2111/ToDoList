import React, { useState, useEffect } from 'react'

export default function ToDoList() {

    let [items, setItems] = useState(() => {
        let storedItems = localStorage.getItem("todoItems");
        return storedItems ? JSON.parse(storedItems) : [];
    });

    useEffect(() => {
        localStorage.setItem("todoItems", JSON.stringify(items));
    }, [items]);

    function handleAddItem(item) {
        setItems((items) => {
            return [...items, item];
        })
    }

    function handleDeleteItem(id) {
        setItems((items) => {
            return items.filter((item) => item.id !== id);
        })
    }

    function handleToggleItem(id) {
        setItems((items) => {
            return items.map((item) => {
                if (item.id === id) return { ...item, carried: !item.carried };
                else return item;
            })
        })
    }

    function handleClearAll() {
        setItems([]); // clears all items from the UI
        localStorage.removeItem("todoItems"); // clears from local storage
    }

    return (
        <>
            <Navbar />
            <Form onAddItem={handleAddItem} />
            {items.length > 0 && (
                <>
                    <ItemsList itemList={items} onDeleteItem={handleDeleteItem} onToggleItem={handleToggleItem} />
                </>
            )}
            <Stats itemList={items} handleClearAll={handleClearAll} />
        </>
    )
}

function Navbar() {
    return (
        <>
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid">
                    <a href="" className='navbar-brand'>🧾 JSpiders Institute</a>
                </div>
            </nav>
        </>
    )
}

function Form({ onAddItem }) {
    let [itemName, setItemName] = useState("");
    let [qty, setQty] = useState("");

    function handleSubmtit(e) {
        if (!itemName || !qty) return;
        e.preventDefault();
        let newItem = { id: Math.round(Math.random() * 50), itemName, qty, carried: false }
        onAddItem(newItem);
        setItemName("");
        setQty("");
    }

    return (
        <>
            <section className="container-fluid mt-3">
                <div className="row">
                    <div className="col-6 m-auto">
                        <div className="card">
                            <div className="card-header bg-dark text-white text-center">
                                <h2>Pack The Items Needed to Attend Class?</h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmtit}>
                                    <div className="mb-2">
                                        <input type="text" className="form-control" placeholder='Item Name' value={itemName} onChange={(e) => { setItemName(e.target.value) }} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder='Quantity' value={qty} onChange={(e) => { setQty(e.target.value) }} />
                                    </div>
                                    <div>
                                        <input type="submit" className="btn btn-dark" value="Add Item" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}


function ItemsList({ itemList, onDeleteItem, onToggleItem }) {
    return (
        <>
            <section className="container-fluid mt-3">
                <div className="row">
                    <div className="col-6 m-auto">
                        <div className="card">
                            <div className="card-body">
                                <ol className="list-group">
                                    {itemList.map(item => <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem} />)}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

function Item({ item, onDeleteItem, onToggleItem }) {
    return (
        <>
            <li className="list-group-item list-group-item-secondary mb-2">
                <input className="form-check-input" type="checkbox" value={item.carried} onChange={() => { onToggleItem(item.id) }} />
                <span className="fw-bold" style={item.carried ? { textDecoration: "line-through" } : {}}>
                    {item.qty} {item.itemName}
                </span>
                <button className="btn float-end" onClick={() => onDeleteItem(item.id)}>❌</button>
            </li>
        </>
    )
}

function Stats({ itemList, handleClearAll }) {

    let totalItems = itemList.length;
    let packedItem = itemList.filter((item) => item.carried).length;
    let percentage = totalItems === 0 ? 0 : Math.round((packedItem / totalItems) * 100);

    return (
        <>
            <section className="container-fluid mt-3">
                <div className="row">
                    <div className="col-6 m-auto">
                        <div className="card">
                            <div className="card-body bg-dark text-white text-center">

                                <h2>
                                    {percentage == 100 && "You Can Start...."}
                                    {
                                        (itemList.length == 0) ? "Your List Is Empty!" : `You Have ${totalItems} Items In Your List, You Packed ${packedItem} Items. (${percentage}%)`
                                    }
                                </h2>

                                <button className='btn btn-primary mt-3' onClick={handleClearAll} disabled={itemList.length === 0}>
                                    Clear All
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}