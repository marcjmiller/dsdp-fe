export type Metadata = {
	release_type?: ReleaseTypes
}

export type FileData = {
	name: string
	size: number
	metadata?: Metadata
}

export const releaseTypes = [
	'',
	'Out of Cycle',
	'Safety Related',
	'Enhancement Related',
	'Mandatory Update',
]

export type ReleaseTypes = typeof releaseTypes[number]

export type FileInput = {
	file: File | null
	releaseType: ReleaseTypes
}
