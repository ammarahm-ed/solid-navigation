

import { Component, createSignal } from "solid-js";
import { ListView } from "~/components/collectionview";

const Item: Component<{
    item?: () => any;
    index?: () => number;
    type: () => string;
}> = (props) => {
    return props.type() === "even" ? (
        <stacklayout
            style={{ height: 100, padding: 10, backgroundColor: "#3a86ff" }}
        >
            <label text={props.item?.().index + ""} />
        </stacklayout>
    ) : (
        <stacklayout
            style={{ height: 50, padding: 10, backgroundColor: "#fca311" }}
        >
            <label text={props.item?.().index + ""} />
        </stacklayout>
    );
};

export const ScreenThree = () => {
    const [items, setItems] = createSignal([0, 1, 2, 3, 4, 5]);

    return (
        <>
            <actionbar title="Home" />
            <flexboxlayout flexDirection="column">
                <button
                    text="Add item"
                    style={{
                        "background-color": "#ef476f",
                        width: 200,
                        "border-radius": 10,
                        height: 45,
                        minHeight: 45,
                        marginBottom: 10,
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 10,
                        color: "white"
                    }}
                    on: tap={() => {
                        setItems((prev) => {
                            return [...prev, prev.length];
                        });
                    }}
                />

                <button
                    text="Remove item"
                    style={{
                        "background-color": "#212529",
                        width: 200,
                        "border-radius": 10,
                        height: 45,
                        minHeight: 45,
                        marginBottom: 10,
                        marginLeft: 10,
                        marginRight: 10,
                        color: "white"
                    }}
                    on: tap={() => {
                        setItems((prev) => {
                            return prev.slice(1)
                        });
                    }}
                />

                <ListView
                    itemTypes={["even", "odd"]}
                    items={items()}
                    renderItem={({ item, index, type }) => (
                        <Item item={item} index={index} type={type} />
                    )}
                    onItemType={(item, index) => {
                        return index % 2 === 0 ? "even" : "odd";
                    }}
                />
            </flexboxlayout>
        </>
    );
};
