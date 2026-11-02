"use client"

import React from "react";

type modalProps = {
    title: string;
    children: React.ReactNode;
    onCloseAction: () => void;
};

export default function Modal({title, children, onCloseAction}: modalProps) {
    return (
        <div className="fixed inset-0 z-100 grid place-items-center p-4">

            {/* Background overlay */}
            <button
                type="button"
                aria-label="Close modal"
                className="absolute inset-0 bg-black/50"
                onClick={onCloseAction}
            />

            {/* Modal content */}
            <div className="relative z-10 flex w-full max-w-lg max-h-[90vh] flex-col gap-10 overflow-y-auto rounded-2xl bg-white p-10 shadow-xl">

                <h2 className="text-2xl font-bold">
                    {title}
                </h2>

                {children}

            </div>
        </div>
    );
}