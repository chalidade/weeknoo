import type { ChartSpec } from '@/data/types'
import { BarChart } from './BarChart'
import { ColumnChart } from './ColumnChart'
import { LineChart } from './LineChart'
import { PieChart } from './PieChart'

export function Chart({ spec, exhibit, staticRender }: { spec: ChartSpec; exhibit?: number; staticRender?: boolean }) {
  const props = { spec, exhibit, staticRender }
  switch (spec.type) {
    case 'bar':
      return <BarChart {...props} />
    case 'column':
      return <ColumnChart {...props} />
    case 'line':
      return <LineChart {...props} />
    case 'pie':
      return <PieChart {...props} />
  }
}
