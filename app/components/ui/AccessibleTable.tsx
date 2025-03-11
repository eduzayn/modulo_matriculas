'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useTranslations } from 'next-intl';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  id?: string;
}

interface AccessibleTableProps<T> {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  summary?: string;
  onRowClick?: (item: T, index: number) => void;
  keyExtractor?: (item: T, index: number) => string;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  sortable?: boolean;
  initialSortColumn?: string;
  initialSortDirection?: 'asc' | 'desc';
}

export function AccessibleTable<T>({
  data,
  columns,
  caption,
  summary,
  onRowClick,
  keyExtractor,
  className = '',
  emptyMessage = 'Nenhum dado encontrado',
  isLoading = false,
  loadingMessage = 'Carregando...',
  sortable = false,
  initialSortColumn,
  initialSortDirection = 'asc',
}: AccessibleTableProps<T>) {
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);
  const [sortColumn, setSortColumn] = useState<string | undefined>(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const { announceToScreenReader } = useAccessibility();
  const t = useTranslations('accessibility');

  // Handle keyboard navigation
  const { handleKeyDown } = useKeyboardNavigation({
    onArrowDown: (event) => {
      if (focusedRowIndex < data.length - 1) {
        event.preventDefault();
        setFocusedRowIndex(focusedRowIndex + 1);
      }
    },
    onArrowUp: (event) => {
      if (focusedRowIndex > 0) {
        event.preventDefault();
        setFocusedRowIndex(focusedRowIndex - 1);
      }
    },
    onHome: (event) => {
      if (data.length > 0) {
        event.preventDefault();
        setFocusedRowIndex(0);
      }
    },
    onEnd: (event) => {
      if (data.length > 0) {
        event.preventDefault();
        setFocusedRowIndex(data.length - 1);
      }
    },
    onEnter: (event) => {
      if (focusedRowIndex >= 0 && focusedRowIndex < data.length && onRowClick) {
        event.preventDefault();
        onRowClick(data[focusedRowIndex], focusedRowIndex);
      }
    },
  });

  // Focus the row when focusedRowIndex changes
  useEffect(() => {
    if (focusedRowIndex >= 0 && focusedRowIndex < data.length) {
      const row = document.getElementById(`table-row-${focusedRowIndex}`);
      if (row) {
        row.focus();
        announceToScreenReader(`Linha ${focusedRowIndex + 1} de ${data.length}`, 'polite');
      }
    }
  }, [focusedRowIndex, data.length, announceToScreenReader]);

  // Sort data if sortable
  const sortedData = React.useMemo(() => {
    if (!sortable || !sortColumn) return data;

    return [...data].sort((a, b) => {
      const column = columns.find(col => col.id === sortColumn || col.header === sortColumn);
      if (!column) return 0;

      const accessor = column.accessor;
      let valueA, valueB;

      if (typeof accessor === 'function') {
        valueA = accessor(a);
        valueB = accessor(b);
      } else {
        valueA = a[accessor];
        valueB = b[accessor];
      }

      // Convert to string for comparison if not already
      if (typeof valueA !== 'string') valueA = String(valueA);
      if (typeof valueB !== 'string') valueB = String(valueB);

      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }, [data, sortable, sortColumn, sortDirection, columns]);

  const handleSort = (columnId: string) => {
    if (!sortable) return;

    if (sortColumn === columnId) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column
      setSortColumn(columnId);
      setSortDirection('asc');
    }

    // Announce sort to screen readers
    const column = columns.find(col => col.id === columnId || col.header === columnId);
    if (column) {
      const direction = sortColumn === columnId && sortDirection === 'asc' ? 'descendente' : 'ascendente';
      announceToScreenReader(`Tabela ordenada por ${column.header} em ordem ${direction}`, 'polite');
    }
  };

  // Generate a unique key for each row
  const getRowKey = (item: T, index: number) => {
    if (keyExtractor) {
      return keyExtractor(item, index);
    }
    return `row-${index}`;
  };

  // Render cell content
  const renderCell = (item: T, column: Column<T>) => {
    const accessor = column.accessor;
    if (typeof accessor === 'function') {
      return accessor(item);
    }
    return item[accessor] as React.ReactNode;
  };

  return (
    <div className="overflow-x-auto" role="region" aria-label={caption || 'Tabela de dados'}>
      {isLoading ? (
        <div className="p-4 text-center" aria-live="polite">
          {loadingMessage}
        </div>
      ) : data.length === 0 ? (
        <div className="p-4 text-center" aria-live="polite">
          {emptyMessage}
        </div>
      ) : (
        <table
          className={`w-full border-collapse ${className}`}
          summary={summary}
          onKeyDown={handleKeyDown}
        >
          {caption && <caption className="text-lg font-medium p-2">{caption}</caption>}
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.id || `header-${index}`}
                  className="border-b p-2 text-left font-medium"
                  scope="col"
                  onClick={() => sortable && handleSort(column.id || column.header)}
                  style={{ cursor: sortable ? 'pointer' : 'default' }}
                  aria-sort={
                    sortable && sortColumn === (column.id || column.header)
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {sortable && sortColumn === (column.id || column.header) && (
                      <span aria-hidden="true">
                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, rowIndex) => (
              <tr
                key={getRowKey(item, rowIndex)}
                id={`table-row-${rowIndex}`}
                className={`border-b ${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                } ${focusedRowIndex === rowIndex ? 'bg-blue-50' : ''}`}
                onClick={() => onRowClick && onRowClick(item, rowIndex)}
                tabIndex={onRowClick ? 0 : -1}
                aria-selected={focusedRowIndex === rowIndex}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="p-2"
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AccessibleTable;
