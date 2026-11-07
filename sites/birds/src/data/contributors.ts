import type { Contributor } from './types'

// SAMPLE PROFILES — every person and company below is fictional placeholder
// content. Replace with real contributors (photoUrl, linkedinUrl, companyUrl)
// before publishing. An empty photoUrl renders a monogram portrait.

const BAUGMENT_BIO =
  'Baugment partners with organisations across the GCC, Southeast Asia and global markets to build leadership capability, workforce intelligence and measurable learning impact.'
const BAUGMENT_URL = 'https://www.linkedin.com/'
const LINKEDIN = 'https://www.linkedin.com/'

const baugment = (
  fullName: string,
  role: Contributor['role'],
  title: string,
  personalBio: string,
): Contributor => ({
  fullName,
  role,
  title,
  company: 'Baugment',
  photoUrl: '',
  linkedinUrl: LINKEDIN,
  personalBio,
  companyBio: BAUGMENT_BIO,
  companyUrl: BAUGMENT_URL,
})

export const AUTHORS = {
  layla: baugment(
    'Layla Haddad',
    'editor',
    'Editor-in-Chief, Birds',
    'Layla leads Birds’ editorial and research agenda, with fifteen years covering workforce strategy and executive education across the Middle East and Asia.',
  ),
  arif: baugment(
    'Arif Santoso',
    'author',
    'Head of Workforce Intelligence',
    'Arif runs Baugment’s skills-analytics practice, translating labour-market and assessment data into decisions for CHROs and boards.',
  ),
  noor: baugment(
    'Noor Al-Rashid',
    'author',
    'Principal, Leadership Practice',
    'Noor advises executive teams on leadership transitions, culture and the human side of large-scale transformation.',
  ),
  mei: baugment(
    'Mei Lin Tan',
    'author',
    'Senior Researcher, Learning Science',
    'Mei Lin studies attention, memory and behaviour change, and designs evidence-based learning experiences for senior leaders.',
  ),
  daniel: baugment(
    'Daniel Ferreira',
    'author',
    'Director, Impact & Measurement',
    'Daniel builds measurement frameworks that connect people investments to financial, operational and ESG outcomes.',
  ),
}

const expert = (
  fullName: string,
  title: string,
  company: string,
  personalBio: string,
  companyBio: string,
): Contributor => ({
  fullName,
  role: 'expert',
  title,
  company,
  photoUrl: '',
  linkedinUrl: LINKEDIN,
  personalBio,
  companyBio,
  companyUrl: 'https://example.com/',
})

export const EXPERTS = {
  hamad: expert(
    'Hamad Al-Mansoori',
    'Chief People Officer',
    'Gulf Horizon Holdings',
    'Hamad oversees talent and culture for a 22,000-person diversified group spanning energy services, logistics and real estate.',
    'Gulf Horizon Holdings is a diversified investment group headquartered in Abu Dhabi with operations in eleven countries.',
  ),
  ratna: expert(
    'Ratna Wijaya',
    'Chief Learning Officer',
    'Nusantara Digital Bank',
    'Ratna built the bank’s capability academy from scratch, training more than 9,000 employees in data and customer skills.',
    'Nusantara Digital Bank is a fast-growing digital bank serving retail and SME customers across Indonesia.',
  ),
  sofia: expert(
    'Sofia Marquez',
    'Labour Economist',
    'Meridian Policy Institute',
    'Sofia researches skills mismatches and the future of work, advising governments on reskilling policy.',
    'Meridian Policy Institute is an independent think tank focused on employment, education and inclusive growth.',
  ),
  kenji: expert(
    'Kenji Watanabe',
    'Head of Leadership Development',
    'Pacific Rim Manufacturing',
    'Kenji leads leadership programmes for plant and regional managers across Japan, Thailand and Vietnam.',
    'Pacific Rim Manufacturing produces precision components for the automotive and electronics industries.',
  ),
  fatima: expert(
    'Dr. Fatima Siddiqui',
    'Organisational Psychologist',
    'Oasis Wellbeing Partners',
    'Fatima specialises in psychological safety, burnout prevention and leadership behaviour under pressure.',
    'Oasis Wellbeing Partners is a consultancy advising employers on mental health, resilience and healthy performance.',
  ),
  aditya: expert(
    'Aditya Rao',
    'VP, People Analytics',
    'Straits Logistics Group',
    'Aditya leads a team of data scientists who model workforce supply, productivity and attrition across 14 markets.',
    'Straits Logistics Group operates ports, warehousing and last-mile delivery networks across Southeast Asia.',
  ),
  claire: expert(
    'Claire Dubois',
    'Partner, Executive Education',
    'Lumen Business School',
    'Claire directs custom executive programmes for multinational leadership teams in Europe and the Middle East.',
    'Lumen Business School offers graduate and executive education with campuses in Paris and Dubai.',
  ),
  omar: expert(
    'Omar Khalil',
    'Group Head of ESG & Sustainability',
    'Arabian Coast Utilities',
    'Omar integrates social and governance metrics into the company’s capital-allocation and reporting processes.',
    'Arabian Coast Utilities provides power and water services to more than three million customers.',
  ),
}
