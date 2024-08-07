import styled from 'styled-components';
import { StepLabel as MUIStepLabel, Step as MUIStep, Stepper as MUIStepper, CircularProgress as MUICircularProgress } from '@mui/material';
import { Box, Typography } from '../../elements';

export const StepLabel = styled(MUIStepLabel)`
 &.MuiStepLabel-root {
   flex-direction: column;
   align-items: flex-start;
   width: 2rem;
 }
`;

export const Step = styled(MUIStep)`
  height: 50px;
 & .MuiStepIcon-root {
  width: 1.75rem;
  height: 1.75rem;
  }
`;

export const Stepper = styled(MUIStepper)`
 & .MuiStepConnector-root{
   margin-top: -1rem;
   flex: 1;
   min-width: 40px;
   margin-right: ${({ topSteps }) => topSteps ? '0.5rem' : 0};
 }

 & .MuiStepLabel-label {
    overflow: visible;
    white-space: break-spaces;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    margin-top: 0.5rem;
}

  ${({ theme }) => theme.breakpoints.down('md')} {
    & .MuiStepLabel-label {
    white-space: break-spaces;
    height: 20px;
    }
  }
`;

export const UploadFileInput = styled('div')`
  pointer-events: ${({ disabled }) => disabled && 'none'}
  opacity: ${({ disabled }) => disabled && '0.8'};
`;

export const InputGroup = styled(Box)`
  display: flex;
  flex-direction: ${({ column }) => column ? 'column' : 'row'} ;
  justify-content: space-between;
  width: 100%;
    ${({ theme }) => theme.breakpoints.down('md')} {
      flex-direction: column;
    }
`;

export const OptionButtons = styled(Box)`
  width: 60px;
  height: 52px;
  margin-right: 0.5rem;
  opacity: ${({ hide }) => hide ? 0 : 1};
  &:hover{
    opacity: ${({ hide }) => hide ? 0 : 0.9};
  }
`;

export const FormTitle = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
`;

export const StepWrapper = styled(Box)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

export const BottomButtonsWrapper = styled(Box).attrs({
  borderTop: '1px solid primary.10;'
})`
  position: absolute;
  display: flex;
  bottom: 0;
  width: 100%;
  height: 80px;
  z-index: 2;
  align-items: center;
  padding-left: 2rem;
  padding-right: 2rem;
  background-color: ${({ theme }) => theme.palette.secondary.main};

  ${({ theme }) => theme.breakpoints.down('md')} {
    position: fixed;
    height: ${({ lastStep }) => lastStep ? '110px' : '80px'};
    padding-left: 0;
    padding-right: 0.25rem;
  }
`;

export const Container = styled(Box)`
  height: 100%;
  position: relative;
`;

export const UploadBox = styled(Box)`
  height: 250px;
  width: 100%;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ required }) => required ? 'rgba(255, 50, 50, 0.02)' : 'rgba(35, 45, 50, 0.02)'};
  border: ${({ required }) => required ? '2px dashed rgba(255,50,50, 0.3)' : '2px dashed rgba(41,45,50, 0.3)'};
  border-radius: 6px;
`;

export const TopStepsWrapper = styled(Box)`
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CircularProgress = styled(MUICircularProgress).attrs({
  size: 60,
  thickness: 4.5
})`
 & .MuiCircularProgress-circle{
   stroke-linecap: round;
 }
`;
