CREATE TABLE [dbo].[tbl_registration] (
 
   
    [Username]    NVARCHAR (100) NOT NULL,
 
    [Password] NVARCHAR (MAX) NOT NULL,
 
  
 
    CONSTRAINT [PK_tbl_registration] PRIMARY KEY CLUSTERED ([Username])
 
);



INSERT INTO tbl_registration (Username,Password)
VALUES ('hasin','12345');

select * from tbl_registration;

select * from tbl_message2 where MessageID='rahim_karim' or MessageID='karim_rahim' order by id asc;

select * from tbl_registration where Username='boss';

select * from tbl_message2;