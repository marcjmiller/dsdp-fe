import { queryByAttribute, render, RenderResult, screen, waitFor } from '@testing-library/react'
import App from './App'
import axios from 'jest-mock-axios'
import user from '@testing-library/user-event'
// import { window } from './__mocks__/window'

// jest.mock("./__mocks__/window")

describe('App', () => {
  let filename: string;
  let formData: FormData = new FormData();
  let file: File;
  let filesize: string;

  beforeEach(async () => {
    filename = `${randomString(6)}.json`

    const str = JSON.stringify('boo')
    const blob = new Blob([str])
    file = new File([blob], filename, { type: 'application/JSON' })
    filesize = `${file.size} Bytes`

    formData.append('files', file)

    axios.post.mockResolvedValueOnce({
      data: [{ _bucket_name: 'bucket', _object_name: filename, _size: file.size }],
    })

    axios.get.mockResolvedValueOnce({
      data: [{ _bucket_name: 'bucket', _object_name: filename, _size: 10 }],
    })

  })

  afterEach(() => {
    axios.reset()
    file = new File([new Blob([""])], "");
    formData = new FormData();
  })

  it('renders upload', () => {
    render(<App />)
    const uploadElement = screen.getByText(
      /Drag and drop a file here or click/i,
    )
    expect(uploadElement).toBeInTheDocument()
  })

  it('uploads a file', async () => {
    const { getByTestId } = render(<App />)

    user.upload(getByTestId(/dropzone/i), file)

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: 'application/json',
        },
      }),
    )
  })

  it('should load the files that have previously been uploaded to minio', async () => {
    const { getByTestId } = render(<App />)

    user.upload(getByTestId(/dropzone/i), file)

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: 'application/json',
        },
      }),
    )

    const filesElement = screen.getByTestId('files-table')
    expect(filesElement).toBeInTheDocument()
    expect(filesElement.innerHTML).toBe(filename)
  })

  it('should show the size of previously uploaded files', async () => {
    const { getByTestId, getByText } = render(<App />)

    user.upload(getByTestId(/dropzone/i), file)


    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: 'application/json',
        },
      }),
    )

    const filesElement = screen.getByTestId('files-table')
    expect(filesElement).toBeInTheDocument()
    expect(filesElement.innerHTML).toBe(filename)
    getByText(filesize)

  })

  it('should show all the historic files that have been uploaded', async () => {
    //When the page loads
    render(<App />)
    //The backend is called to retreive the files from the bucket

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
      expect(axios.get).toHaveBeenCalledWith("/files/list")
    })
  })

  // TODO: Start HERE Tom
  it('should have an element that can hold a logo', async () => {
    //When the page loads
    //You can get the getters from the render function here.
    const { getByTestId } = render(<App />)
    //There should be an element holding a logo
    const logoElement = getByTestId('logo')
    await waitFor(() => {
      expect(logoElement).toBeInTheDocument()
    })
  })


  describe('download', () => {
    let renderResult: RenderResult
    global.URL.createObjectURL = jest.fn()
    beforeEach(async () => {
      renderResult = render(<App />)
      await waitFor(() => {
        axios.get.mockResolvedValue({ data: [{ _bucket_name: 'bucket', _object_name: filename, _size: file.size }] })
      })
    })

    afterEach(async () => {
      axios.reset()
    })

    it('renders a download button', async () => {
      const { queryByLabelText } = renderResult
      //When the page loads
      //Loads stub data
      //A download button should be present for each file
      expect(queryByLabelText("Download")).toBeTruthy()
    })

    it('calls the backend when the Download button is clicked', async () => {
      //@ts-ignore
      window.navigator.msSaveOrOpenBlob = jest.fn()

      const { getByLabelText, container } = renderResult
      user.click(getByLabelText("Download"))
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('/files/list')
        expect(axios.get).toHaveBeenCalledWith(`/files`, { params: { name: filename }, responseType: 'blob' })
      })
    })
  })
})



const randomString = (length: number) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
