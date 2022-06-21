import { render, RenderOptions } from '@testing-library/react'
import { FC, ReactElement, ReactNode } from 'react'
import { FileContextType, FileContext } from '../context/Files/context'
import { Metadata } from '../context/Files/types'
import { UserContextType, UserContext } from '../context/User/context'

const createDtWithFiles = (files: File[] = []) => {
	return {
		dataTransfer: {
			files,
			items: files.map((file) => ({
				kind: 'file',
				size: file.size,
				type: file.type,
				getAsFile: () => file,
			})),
			types: ['Files'],
		},
	}
}

const createFile = (name: string, size: number, type: string) => {
	const file = new File([], name, { type })
	Object.defineProperty(file, 'size', {
		get() {
			return size
		},
	})
	return file
}

const createFileDataStub = (
	name: string = 'test',
	size: number = 12345,
	metadata: Metadata = { release_type: 'Out of Cycle' },
) => {
	return {
		name,
		size,
		metadata,
	}
}

const defaultUserProps: UserContextType = {
	user: {
		name: 'Testy McTesterton',
		isAdmin: false,
		preferred_username: 'computa.anthony',
	},
}

const adminUserProps: UserContextType = {
	user: {
		name: 'AnthonysAComputa',
		isAdmin: true,
		preferred_username: 'computa.anthony',
	},
}

const defaultFileProps: FileContextType = {
	fileData: [],
	handleDelete: jest.fn(),
	handleDownload: jest.fn(),
	percentComplete: 0,
	setFileInput: jest.fn(),
	handleFileUpload: jest.fn(),
	updateFiles: jest.fn(),
	fileInput: {
		file: null,
		releaseType: '',
	},
}

interface AllTheProvidersProps {
	userProviderProps: UserContextType
	fileProviderProps: FileContextType
	children: ReactNode
}

const AllTheProviders: FC<AllTheProvidersProps> = ({
	userProviderProps = defaultUserProps,
	fileProviderProps = defaultFileProps,
	children,
}): ReactElement => {
	return (
		<>
			<UserContext.Provider value={{ ...userProviderProps }}>
				<FileContext.Provider value={{ ...fileProviderProps }}>
					{children}
				</FileContext.Provider>
			</UserContext.Provider>
		</>
	)
}

interface CustomRenderOptions {
	UserProviderProps?: UserContextType
	FileProviderProps?: FileContextType
	testingLibraryOptions?: Omit<RenderOptions, 'wrapper'>
}

const customRender = async (
	ui: ReactElement,
	options?: CustomRenderOptions,
) => {
	return render(ui, {
		wrapper: (props: any) => {
			return (
				<AllTheProviders
					userProviderProps={options?.UserProviderProps}
					fileProviderProps={options?.FileProviderProps}
					{...props}
				/>
			)
		},
		...options?.testingLibraryOptions,
	})
}

export * from '@testing-library/react'
export {
	customRender as render,
	createFile,
	createDtWithFiles,
	createFileDataStub,
	defaultUserProps,
	defaultFileProps,
	adminUserProps,
}
