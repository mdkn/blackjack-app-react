import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend vitest expect with DOM matchers
expect.extend(matchers);
