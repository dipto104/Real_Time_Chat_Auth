CREATE TABLE [dbo].[tbl_registration] (
 
   
    [Username]    NVARCHAR (100) NOT NULL,
 
    [Password] NVARCHAR (MAX) NOT NULL,
 
  
 
    CONSTRAINT [PK_tbl_registration] PRIMARY KEY CLUSTERED ([Username])
 
);

CREATE TABLE [dbo].[tbl_room] (
 
	[ID] INT IDENTITY(1,1),
	[RoomID]    NVARCHAR (100) NOT NULL PRIMARY KEY,
    [CreatorID]    NVARCHAR (50) NOT NULL,
	[PartnerID1]    NVARCHAR (50) NULL,
	[PartnerID2]    NVARCHAR (50) NULL,
	[PartnerID3]    NVARCHAR (50) NULL,
);

CREATE TABLE [dbo].[tbl_group] (
 
	[ID] INT IDENTITY(1,1),
	[RoomID]    NVARCHAR (100) NOT NULL,
    [UserID]    NVARCHAR (50) NOT NULL,
);

CREATE TABLE [dbo].[tbl_groupmessage] (
 
	[ID] INT IDENTITY(1,1),
	[RoomID]    NVARCHAR (100) NOT NULL,
    [FromID]    NVARCHAR (50) NOT NULL,
	[Message]    NVARCHAR (1000) NOT NULL,
);


INSERT INTO tbl_registration (Username,Password)
VALUES ('hasin','12345');

select * from tbl_registration;

select * from tbl_message2 where MessageID='rahim_karim' or MessageID='karim_rahim' order by id asc;

select * from tbl_registration where Username='boss';

select * from tbl_message2;