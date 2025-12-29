# Internal Tool Builder

Build a powerful, efficient internal business tool with React, Tailwind CSS, and JavaScript.

---

## 🎯 Your Mission

Create a **10x quality internal tool** that maximizes team productivity. The tool must be fast, functional, and easy to use for daily operations.

---

## 📋 User Requirements

**Read the user's requirements carefully:**

```
{{USER_REQUIREMENTS}}
```

Parse these requirements to identify:
1. **Business Problem**: What workflow is being automated?
2. **Users**: Who will use this tool (roles, permissions)?
3. **Data Entities**: What data is being managed?
4. **Operations**: What actions can users perform?
5. **Integrations**: External systems to connect?
6. **Reporting**: What insights are needed?

---

## 🛠 Tech Stack

```
Framework:     React 18
Language:      JavaScript (ES6+)
Bundler:       Vite
Styling:       Tailwind CSS
Routing:       React Router DOM v6
State:         Zustand
Tables:        TanStack Table v8
Forms:         React Hook Form
Charts:        Recharts
HTTP:          Axios
Icons:         Lucide React
Dates:         date-fns
Export:        xlsx, file-saver
```

---

## 📁 Project Structure

```
internal-tool/
├── src/
│   ├── components/
│   │   ├── ui/                    # Base components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Spinner.jsx
│   │   ├── tables/                # Table components
│   │   │   ├── DataTable.jsx
│   │   │   ├── TableFilters.jsx
│   │   │   ├── TablePagination.jsx
│   │   │   └── BulkActions.jsx
│   │   ├── forms/                 # Form components
│   │   │   ├── FormField.jsx
│   │   │   ├── FormSection.jsx
│   │   │   └── FormActions.jsx
│   │   ├── charts/                # Chart components
│   │   │   ├── LineChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   └── PieChart.jsx
│   │   └── layout/
│   │       ├── Layout.jsx
│   │       ├── Sidebar.jsx
│   │       ├── Header.jsx
│   │       └── PageHeader.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── records/
│   │   │   ├── RecordList.jsx
│   │   │   ├── RecordDetail.jsx
│   │   │   └── RecordForm.jsx
│   │   ├── users/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── Login.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTable.js
│   │   ├── usePagination.js
│   │   └── useExport.js
│   ├── stores/
│   │   └── useStore.js
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── utils/
│   │   ├── format.js
│   │   ├── export.js
│   │   └── permissions.js
│   └── constants/
│       └── index.js
├── package.json
└── tailwind.config.js
```

---

## 🚀 Build Process

### Phase 1: Project Setup

```bash
npm create vite@latest internal-tool -- --template react
cd internal-tool

npm install react-router-dom zustand axios react-hook-form
npm install @tanstack/react-table recharts
npm install lucide-react date-fns xlsx file-saver

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Phase 2: Data Table Component

```jsx
// src/components/tables/DataTable.jsx
import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react'
import TableFilters from './TableFilters'
import TablePagination from './TablePagination'
import BulkActions from './BulkActions'

const DataTable = ({
  data,
  columns,
  loading = false,
  searchable = true,
  filterable = true,
  selectable = true,
  onBulkAction,
  filterConfig = [],
}) => {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({})

  const tableColumns = useMemo(() => {
    if (!selectable) return columns

    return [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="rounded border-gray-300"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded border-gray-300"
          />
        ),
        size: 40,
      },
      ...columns,
    ]
  }, [columns, selectable])

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: selectable,
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {filterable && filterConfig.length > 0 && (
            <TableFilters
              config={filterConfig}
              filters={columnFilters}
              onChange={setColumnFilters}
            />
          )}
        </div>

        {selectedRows.length > 0 && onBulkAction && (
          <BulkActions
            selectedCount={selectedRows.length}
            onAction={(action) => onBulkAction(action, selectedRows)}
          />
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {{
                                asc: <ChevronUp className="w-4 h-4" />,
                                desc: <ChevronDown className="w-4 h-4" />,
                              }[header.column.getIsSorted()] ?? (
                                <ChevronsUpDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 ${row.getIsSelected() ? 'bg-blue-50' : ''}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <TablePagination table={table} />
    </div>
  )
}

export default DataTable
```

### Phase 3: Form Components

```jsx
// src/components/forms/FormField.jsx
import { useFormContext } from 'react-hook-form'

const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  options = [],
  rows = 3,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message

  const inputClasses = `
    w-full px-4 py-2 border rounded-lg
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-300'}
  `

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          {...register(name)}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
        />
      ) : type === 'select' ? (
        <select {...register(name)} className={inputClasses}>
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register(name)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">{placeholder}</span>
        </div>
      ) : (
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default FormField
```

### Phase 4: Dashboard Components

```jsx
// src/components/charts/StatCard.jsx
import { ArrowUp, ArrowDown } from 'lucide-react'

const StatCard = ({ title, value, change, changeLabel, icon: Icon, color = 'blue' }) => {
  const isPositive = change > 0
  const isNegative = change < 0

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>

      {change !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`flex items-center text-sm font-medium ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : isNegative ? (
              <ArrowDown className="w-4 h-4" />
            ) : null}
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500">{changeLabel}</span>
        </div>
      )}
    </div>
  )
}

export default StatCard
```

### Phase 5: Export Functionality

```javascript
// src/utils/export.js
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportToExcel = (data, filename = 'export') => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, `${filename}.xlsx`)
}

export const exportToCSV = (data, filename = 'export') => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const csvContent = XLSX.utils.sheet_to_csv(worksheet)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, `${filename}.csv`)
}
```

### Phase 6: Permission System

```javascript
// src/utils/permissions.js
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
  VIEWER: 'viewer',
}

export const PERMISSIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  EXPORT: 'export',
  MANAGE_USERS: 'manage_users',
}

const rolePermissions = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [PERMISSIONS.CREATE, PERMISSIONS.READ, PERMISSIONS.UPDATE, PERMISSIONS.EXPORT],
  [ROLES.MEMBER]: [PERMISSIONS.CREATE, PERMISSIONS.READ, PERMISSIONS.UPDATE],
  [ROLES.VIEWER]: [PERMISSIONS.READ],
}

export const hasPermission = (userRole, permission) => {
  return rolePermissions[userRole]?.includes(permission) ?? false
}

export const canPerformAction = (user, action, resource) => {
  if (!user) return false
  if (user.role === ROLES.ADMIN) return true

  // Check resource-specific permissions
  if (resource && resource.createdBy === user.id) {
    return true // Users can edit their own resources
  }

  return hasPermission(user.role, action)
}
```

---

## 🎨 Design Guidelines

### Layout
- Fixed sidebar navigation
- Collapsible on mobile
- Breadcrumb navigation
- Compact information density

### Colors
- Primary: Blue for actions
- Success: Green for positive
- Warning: Amber for caution
- Error: Red for destructive
- Neutral grays for backgrounds

### Tables
- Sortable columns
- Filterable data
- Bulk selection
- Row hover states
- Pagination

### Forms
- Clear labels
- Inline validation
- Required field indicators
- Helpful placeholders

---

## ✅ Quality Checklist

- [ ] All CRUD operations work
- [ ] Table sorting and filtering work
- [ ] Bulk actions function correctly
- [ ] Export to Excel/CSV works
- [ ] Forms validate properly
- [ ] Error states are handled
- [ ] Loading states displayed
- [ ] Permissions are enforced
- [ ] Responsive on tablets
- [ ] Keyboard navigable

---

Now build the internal tool based on the user's requirements!
