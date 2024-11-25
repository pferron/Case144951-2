import { FileUpload, FileUploadReadOnly, FileType } from '@cvent/carina/components/FileUpload';
import { useTheme } from '@cvent/carina/components/ThemeProvider';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CSSObject } from '@emotion/react';
import { saveAs } from 'file-saver';
import { useTranslate } from 'nucleus-text';
import { ACCEPTED_FILE_FORMAT_FOR_FILE_UPLOAD } from '@utils/constants';

const LOG = LoggerFactory.create('home-page-section-image-upload');

const useStyles = (): Record<string, CSSObject> => {
  const { font } = useTheme();
  return {
    readOnlyContainer: {
      marginTop: '-2.5rem'
    },
    recommendationText: {
      fontSize: font.base.size.xs,
      color: font.color.soft
    }
  };
};

interface Props {
  acceptedFileAction: (accepted: FileType[]) => void;
  currentImage: { url: string; filename?: string } | null;
  imagefile: FileType | null;
  onRemove: () => void;
  onEditFile: () => void;
  recommendationTextForFileUpload: string;
}

function FileUploadWrapper({
  acceptedFileAction,
  currentImage,
  imagefile,
  onRemove,
  onEditFile,
  recommendationTextForFileUpload
}: Props): React.JSX.Element {
  const onDownload = async () => {
    try {
      const response = await fetch(currentImage?.url);
      const blob = await response.blob();
      saveAs(blob, currentImage?.filename);
    } catch (error) {
      LOG.error('Download failed', error);
    }
  };

  const { translate } = useTranslate();
  const { recommendationText, readOnlyContainer } = useStyles();
  return (
    <div>
      {!currentImage || !imagefile ? (
        <div>
          <FileUpload
            uploadLabel={translate('shared_upload_input_accessibility_label')}
            acceptedFilesLabel={translate('home_page_new_section_supported_file_types_label')}
            testID="section-image-file-upload"
            onFileSelected={accepted => {
              if (accepted.length) {
                acceptedFileAction(accepted);
              }
            }}
            acceptedFileTypes={ACCEPTED_FILE_FORMAT_FOR_FILE_UPLOAD}
            onRemoveFile={onRemove}
            files={imagefile ? [imagefile] : undefined}
            multiple={false}
          />
          <span css={recommendationText}>{recommendationTextForFileUpload}</span>
        </div>
      ) : (
        <div css={readOnlyContainer}>
          <FileUploadReadOnly
            fileActions={[
              {
                label: translate('image_edit_button'),
                onSelect: onEditFile
              },
              {
                label: translate('image_delete_button'),
                onSelect: onRemove
              }
            ]}
            onDownload={onDownload}
            files={[imagefile]}
            labels={{
              attachmentCount: '',
              download: translate('download_button_label'),
              downloadAll: '',
              showAll: ''
            }}
            testID="section-image-upload-readOnly"
          />
        </div>
      )}
    </div>
  );
}

export default FileUploadWrapper;
