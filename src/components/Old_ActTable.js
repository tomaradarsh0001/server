'use client'
import React, { useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import searchIcon from '../../public/searchIcon.svg'
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Translate from '../language.json'

//added a prop customContainerClass in order to handle div introduction-container without padding for club membership form's listing by Swati Mishra on 01-02-2025
const ActTable = ({ columns, data, language = "english", customContainerClass }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const { globalFilter, pageIndex } = state;

    const memoizedColumns = useMemo(() => columns, [columns]);
    const containerClass = customContainerClass || 'introduction-container px-4 md:px-4 py-10 md:pb-28 lg:py-10 lg:pb-32 lg:px-8 xl:px-10 2xl:px-24 xl:pb-24';

    return (
        <div className= {containerClass}>
            <div className='w-full m-auto px-4'>
                <div className='filter-container flex items-center' data-aos="fade-up" data-aos-duration="1000">
                    <h3 className='mr-3 text-lg lg:text-xl'>{Translate.searchBy[language]}</h3>
                    <div className='relative w-3/4 md:w-1/3 rounded-full bg-white border-zinc-500 dropdown-filter'>
                        <input
                            type="text"
                            value={globalFilter || ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder={Translate.searchPlaceholder[language]}
                            className='bg-transparent w-full outline-none pl-10 md:pl-16 text-lg py-2 lg:py-2'
                        />
                        <Image src={searchIcon} alt='Search' className='w-4 h-4 lg:w-6 lg:h-6 absolute top-1/2 -translate-y-1/2 left-4' />
                    </div>
                </div>
                
                <div className='table-responsive y-hidden'>
                    <table {...getTableProps()} style={{ width: '100%' }} className='table-container' data-aos="fade-up" data-aos-duration="1000">
                        <thead>
                            {headerGroups.map((headerGroup, index) => (
                                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column, index) => (
                                        <th key={index} className='text-base font-semibold' {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, index) => {
                                prepareRow(row);
                                return (
                                    <tr key={index} {...row.getRowProps()}>
                                        {row.cells.map((cell) => (
                                            <td key={index} className='text-base' {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className='flex items-center gap-4 mt-5 justify-end'>
                    <button className='bg-zinc-300 w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-md text-white pagination-btn' onClick={() => previousPage()} disabled={!canPreviousPage}>
                        <ChevronLeft />
                    </button>{' '}
                    <span className='text-base lg:text-lg'>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {page.length}
                        </strong>{' '}
                    </span>
                    <button onClick={() => nextPage()} disabled={!canNextPage} className='bg-zinc-300 w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-md text-white pagination-btn'>
                        <ChevronRight />
                    </button>{' '}
                </div>
            </div>
        </div>
    );
};

export default ActTable;