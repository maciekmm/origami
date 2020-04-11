import React, { useEffect, useState } from 'react'

export const useAfter = (callback, after, deps) => {
    useEffect(() => {
        let tid = setTimeout(() => {
            callback()
        }, after)

        return () => {
            clearTimeout(tid)
        }
    }, deps)
}