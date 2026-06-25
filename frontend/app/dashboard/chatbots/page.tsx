'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import type { Widget } from '@/lib/types'

export default function ChatbotsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // Fetch all widgets and businesses concurrently
        const [widgetData, businessData] = await Promise.all([
          api<{ widgets: Widget[] }>('/api/widget'),
          api<{ businesses: { id: string; name: string }[] }>('/api/business/mine')
        ])
        if (!cancelled) {
          setWidgets(widgetData.widgets ?? [])
          setBusinesses(businessData.businesses ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load widgets')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Chat widgets</h2>
            <p className="text-muted-foreground mt-2">
              Manage the embeddable chat widgets for your businesses
            </p>
          </div>
          {error !== 'Business not found' && (
            <Link href="/dashboard/chatbots/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New widget
              </Button>
            </Link>
          )}
        </div>

        {error && error === 'Business not found' ? (
          <div className="mb-6 p-6 bg-amber-50 text-amber-900 rounded-lg text-center border border-amber-200">
            <p className="mb-4">You need to create a business profile before you can add chat widgets.</p>
            <Link href="/dashboard/businesses/new">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Create a Business
              </Button>
            </Link>
          </div>
        ) : error ? (
          <div className="mb-6 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        ) : null}

        <div className="bg-card rounded-lg border border-border">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading widgets…
            </div>
          ) : error === 'Business not found' ? (
             <div className="p-12 text-center text-muted-foreground">
               No business profile found.
             </div>
          ) : widgets.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No widgets yet. Create your first chat widget to get started.
              </p>
              <Link href="/dashboard/chatbots/new">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create widget
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-border">
                <Input
                  type="text"
                  placeholder="Search chatbots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              {businesses.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No chatbots match your search.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {businesses.map((business) => {
                    const businessWidgets = widgets
                      .filter((w) => w.businessId === business.id)
                      .filter((w) => w.title.toLowerCase().includes(searchQuery.toLowerCase()))

                    if (businessWidgets.length === 0 && searchQuery) {
                      return null; // Hide business block if searching and no match
                    }

                    return (
                      <div key={business.id} className="p-0">
                        <div className="bg-secondary/20 px-5 py-3 border-b border-border">
                          <h3 className="font-semibold text-sm text-foreground/80">{business.name}</h3>
                        </div>
                        {businessWidgets.length === 0 ? (
                          <div className="p-5 text-sm text-muted-foreground text-center">
                            No widgets created for this business yet.
                          </div>
                        ) : (
                          <ul className="divide-y divide-border">
                            {businessWidgets.map((w) => (
                              <li key={w.id} className="p-5 flex items-center justify-between hover:bg-secondary/5 transition-colors">
                                <div>
                                  <Link
                                    href={`/dashboard/chatbots/${w.id}`}
                                    className="font-medium hover:underline text-primary"
                                  >
                                    {w.title}
                                  </Link>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Public URL: <span className="font-mono">/{w.slug}</span> · {w.theme} ·{' '}
                                    {w.position} · {w.isEnabled ? 'active' : 'disabled'}
                                  </p>
                                </div>
                                <Link href={`/dashboard/chatbots/${w.id}`}>
                                  <Button variant="outline" size="sm">
                                    Manage
                                  </Button>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
