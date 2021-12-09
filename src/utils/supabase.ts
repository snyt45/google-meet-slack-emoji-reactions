import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://czfvcyopzirsttiwsmqo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2OTIxOCwiZXhwIjoxOTU0NTQ1MjE4fQ.5OiWYZ_OjDHdxQGc0xEPP2uey0B9hmQMXaFBEUZZY5k'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export { supabase }
