import styled from 'styled-components';

export const StyledBreadcrumbs = styled.div`
  background: ${({ theme }) => theme.colors.primaryColor};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 5px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  width: 100%;
  padding: 0 20px;
  margin: 20px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const StyledBreadcrumbLink = styled.a`
  position: relative;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 500;
  line-height: 40px;
  text-decoration: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 11px;
  padding-right: 20px;

  &:not(:last-of-type)::after {
    position: absolute;
    content: '•';
    right: 8px;
    line-height: 40px;
    font-size: 11px;
  }

  &:hover {
    text-decoration: underline;
  }
`;
