import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import StatusBadge from '../StatusBadge'

describe('StatusBadge', () => {
  it('renders with correct status for sites', () => {
    const { getByText } = render(<StatusBadge status="ACTIVE" type="site" />)
    
    const badge = getByText('Active')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('renders with correct status for rooms', () => {
    const { getByText } = render(<StatusBadge status="OCCUPIED" type="room" />)
    
    const badge = getByText('Occupied')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('renders with correct status for assets', () => {
    const { getByText } = render(<StatusBadge status="MAINTENANCE" type="asset" />)
    
    const badge = getByText('Maintenance')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('applies custom className', () => {
    const { getByText } = render(<StatusBadge status="ACTIVE" type="site" className="custom-class" />)
    
    const badge = getByText('Active')
    expect(badge).toHaveClass('custom-class')
  })

  it('handles unknown status gracefully', () => {
    const { getByText } = render(<StatusBadge status="UNKNOWN" type="site" />)
    
    const badge = getByText('UNKNOWN')
    expect(badge).toBeInTheDocument()
  })
})