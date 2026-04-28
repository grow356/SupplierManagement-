import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ftbygarwrkinptqjayje.supabase.co'
const supabaseAnonKey = 'sb_publishable_iDc80wJknrOmtonjnJZtuw_52eIk_92'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const saveCustomer = async (customer) => {
  const { id, ...data } = customer
  
  if (id) {
    // Update
    const { error } = await supabase
      .from('customers')
      .update(data)
      .eq('id', id)
    if (error) throw error
  } else {
    // Create
    const { error } = await supabase
      .from('customers')
      .insert([data])
    if (error) throw error
  }
}

export const deleteCustomer = async (id) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)
  if (error) throw error
}
