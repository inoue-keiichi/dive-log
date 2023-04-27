import { fireEvent, screen } from "@testing-library/react";

export const fill = (e: HTMLElement, value: string) => {
  fireEvent.change(e, { target: { value } });
};
