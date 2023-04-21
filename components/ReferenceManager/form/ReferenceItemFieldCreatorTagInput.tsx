import React, { ReactElement, useEffect, useState } from "react";
import { TagsInput } from "react-tag-input-component";
import { InputProps } from "./ReferenceItemFieldInput";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import colors from "~/config/themes/colors";

type Props = InputProps & {};

export default function ReferenceItemFieldCreatorTagInput({
  disabled,
  label,
  onChange,
  required = false,
  value = "",
}: Props): ReactElement {
  return (
    <Box
      sx={{
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        marginBottom: "16px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Typography
        color="rgba(36, 31, 58, 1)"
        fontSize="14px"
        fontWeight={600}
        lineHeight="22px"
        letterSpacing={0}
        mb="4px"
        sx={{ background: "transparent" }}
        width="100%"
      >
        {label}
        {required ? <span style={{ color: colors.BLUE() }}>{"*"}</span> : null}
      </Typography>
      <TagsInput
        disabled={Boolean(disabled)}
        value={value}
        onChange={onChange}
        placeHolder={"(press enter)"}
      />
    </Box>
  );
}
