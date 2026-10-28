import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {}

// withPayload branche l'admin (/admin) et l'API Payload sur l'app Next.
export default withPayload(nextConfig)
