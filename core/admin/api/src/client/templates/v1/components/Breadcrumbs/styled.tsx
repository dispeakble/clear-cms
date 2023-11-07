import styled from 'styled-components';

export const StyledBreadcrumbs = styled.div`
  background: ${({ theme }) => theme.colors.primaryColor};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  width: 100%;
  margin: 30px 0;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const StyledBreadcrumbLink = styled.a`
  position: relative;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 500;
  text-decoration: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 11px;
  padding: 0 10px;

  &:hover {
    text-decoration: underline;
  }
`;
