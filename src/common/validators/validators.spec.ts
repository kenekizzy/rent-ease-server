import { validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { Match } from './match.validator';
import { IsAfterDate } from './date-range.validator';
import { IsValidMimeType, IsValidFileSize } from './file.validator';

class TestMatchDto {
  password: string;

  @Match('password')
  confirmPassword: string;
}

class TestDateRangeDto {
  startDate: string;

  @IsAfterDate('startDate')
  endDate: string;
}

class TestFileDto {
  @IsValidMimeType(['image/jpeg', 'image/png'])
  mimeType: string;

  @IsValidFileSize(1024 * 1024) // 1MB
  fileSize: number;
}

describe('Custom Validators', () => {
  describe('Match Validator', () => {
    it('should pass when passwords match', async () => {
      const dto = new TestMatchDto();
      dto.password = 'test123';
      dto.confirmPassword = 'test123';

      const errors = await validate(dto);
      const matchErrors = errors.filter(error => 
        error.property === 'confirmPassword' && error.constraints?.['match']
      );
      
      expect(matchErrors).toHaveLength(0);
    });

    it('should fail when passwords do not match', async () => {
      const dto = new TestMatchDto();
      dto.password = 'test123';
      dto.confirmPassword = 'different';

      const errors = await validate(dto);
      const matchErrors = errors.filter(error => 
        error.property === 'confirmPassword' && error.constraints?.['match']
      );
      
      expect(matchErrors).toHaveLength(1);
    });
  });

  describe('IsAfterDate Validator', () => {
    it('should pass when end date is after start date', async () => {
      const dto = new TestDateRangeDto();
      dto.startDate = '2024-01-01';
      dto.endDate = '2024-01-02';

      const errors = await validate(dto);
      const dateErrors = errors.filter(error => 
        error.property === 'endDate' && error.constraints?.['isAfterDate']
      );
      
      expect(dateErrors).toHaveLength(0);
    });

    it('should fail when end date is before start date', async () => {
      const dto = new TestDateRangeDto();
      dto.startDate = '2024-01-02';
      dto.endDate = '2024-01-01';

      const errors = await validate(dto);
      const dateErrors = errors.filter(error => 
        error.property === 'endDate' && error.constraints?.['isAfterDate']
      );
      
      expect(dateErrors).toHaveLength(1);
    });
  });

  describe('File Validators', () => {
    it('should pass for valid MIME type', async () => {
      const dto = new TestFileDto();
      dto.mimeType = 'image/jpeg';
      dto.fileSize = 500000; // 500KB

      const errors = await validate(dto);
      const mimeErrors = errors.filter(error => 
        error.property === 'mimeType' && error.constraints?.['isValidMimeType']
      );
      
      expect(mimeErrors).toHaveLength(0);
    });

    it('should fail for invalid MIME type', async () => {
      const dto = new TestFileDto();
      dto.mimeType = 'application/exe';
      dto.fileSize = 500000;

      const errors = await validate(dto);
      const mimeErrors = errors.filter(error => 
        error.property === 'mimeType' && error.constraints?.['isValidMimeType']
      );
      
      expect(mimeErrors).toHaveLength(1);
    });

    it('should fail for file size too large', async () => {
      const dto = new TestFileDto();
      dto.mimeType = 'image/jpeg';
      dto.fileSize = 2 * 1024 * 1024; // 2MB

      const errors = await validate(dto);
      const sizeErrors = errors.filter(error => 
        error.property === 'fileSize' && error.constraints?.['isValidFileSize']
      );
      
      expect(sizeErrors).toHaveLength(1);
    });
  });
});