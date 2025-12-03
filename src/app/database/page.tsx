'use client'

import { useState } from 'react'
import { SiteNavigation } from '@/components/SiteNavigation'
import { SiteFooterContent } from '@/components/SiteFooterContent'

type DatabaseType = 'members' | 'volunteers' | 'donors' | null

interface SearchResult {
  id: string
  fields: Record<string, string | number | boolean | null | undefined>
}

interface UserAccount {
  name: string
  username: string
}

export default function DatabasePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null)
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseType>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAuthenticated(true)
        setCurrentUser(data.user)
        setLoginError('')
      } else {
        setLoginError(data.error || 'Invalid username or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Authentication failed. Please try again.')
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a name or phone number')
      return
    }

    setIsSearching(true)
    setSearchError('')
    setSearchResults([])

    try {
      const response = await fetch('/api/database-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: selectedDatabase,
          query: searchQuery,
        }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setSearchResults(data.records || [])
      
      if (data.records.length === 0) {
        setSearchError('No results found')
      }
    } catch (error) {
      setSearchError('Error searching database. Please try again.')
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const renderFieldValue = (key: string, value: string | number | boolean | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteNavigation />
        <main className="grow bg-gray-50 py-12">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="font-['Jost',sans-serif] font-bold text-3xl text-gray-900 mb-6">
                Database Access
              </h1>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 font-['Bitter',serif] focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20"
                    placeholder="Username"
                    autoComplete="username"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 font-['Bitter',serif] focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20"
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                  {loginError && (
                    <p className="text-red-600 text-sm mt-2 font-['Bitter',serif]">{loginError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-lg px-6 py-3 transition-all duration-300"
                >
                  Log In
                </button>
              </form>
            </div>
          </div>
        </main>
        <SiteFooterContent />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavigation />
      <main className="grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-['Jost',sans-serif] font-bold text-3xl text-gray-900">
                Database Search
              </h1>
              <button
                onClick={() => {
                  setIsAuthenticated(false)
                  setCurrentUser(null)
                  setUsername('')
                  setPassword('')
                  setSelectedDatabase(null)
                  setSearchQuery('')
                  setSearchResults([])
                }}
                className="text-gray-600 hover:text-gray-900 font-['Jost',sans-serif] text-sm underline"
              >
                Log Out
              </button>
            </div>

            {!selectedDatabase ? (
              <div>
                <p className="font-['Bitter',serif] text-gray-700 mb-6">
                  Select a database to search:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setSelectedDatabase('members')}
                    className="bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-lg px-6 py-8 transition-all duration-300"
                  >
                    Members
                  </button>
                  <button
                    onClick={() => setSelectedDatabase('volunteers')}
                    className="bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold text-lg px-6 py-8 transition-all duration-300"
                  >
                    Volunteers
                  </button>
                  <button
                    disabled
                    className="bg-gray-300 text-gray-600 rounded-lg font-['Jost',sans-serif] font-semibold text-lg px-6 py-8 cursor-not-allowed relative"
                  >
                    Donors
                    <span className="block text-sm font-normal mt-2">Coming Soon</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => {
                      setSelectedDatabase(null)
                      setSearchQuery('')
                      setSearchResults([])
                      setSearchError('')
                    }}
                    className="text-[#427d78] hover:text-[#5eb3a1] font-['Jost',sans-serif] font-semibold"
                  >
                    ← Back to Database Selection
                  </button>
                  <h2 className="font-['Jost',sans-serif] font-bold text-xl text-gray-900">
                    Searching: {selectedDatabase === 'members' ? 'Members' : 'Volunteers'}
                  </h2>
                </div>

                <div className="mb-6">
                  <label htmlFor="search" className="block font-['Jost',sans-serif] font-semibold text-gray-900 mb-2">
                    Search by Name or Phone Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 font-['Bitter',serif] focus:border-[#427d78] focus:outline-none focus:ring-2 focus:ring-[#427d78] focus:ring-opacity-20"
                      placeholder="Enter name or phone number..."
                    />
                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="bg-[#427d78] hover:bg-[#5eb3a1] text-white rounded-lg font-['Jost',sans-serif] font-semibold px-6 py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  {searchError && (
                    <p className="text-red-600 text-sm mt-2 font-['Bitter',serif]">{searchError}</p>
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-['Jost',sans-serif] font-bold text-lg text-gray-900">
                      Results ({searchResults.length})
                    </h3>
                    {searchResults.map((result) => (
                      <div key={result.id} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(result.fields).map(([key, value]) => (
                            <div key={key} className="font-['Bitter',serif]">
                              <strong className="text-gray-700">{key}:</strong>{' '}
                              <span className="text-gray-900">{renderFieldValue(key, value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooterContent />
    </div>
  )
}
