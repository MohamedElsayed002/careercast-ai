import { caller } from "@/trpc/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, User, Calendar, MessageSquare } from "lucide-react"

const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'Unknown date'
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return 'Invalid date'
    }
}

export const Messages = async () => {
    const messages = await caller.getMessages()

    // Sort messages by date (newest first)
    const sortedMessages = [...(messages || [])].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    if (!sortedMessages || sortedMessages.length === 0) {
        return (
            <div className="container mx-auto px-6 py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>Contact form messages from users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <MessageSquare className="size-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                            <p className="text-muted-foreground">When users submit the contact form, their messages will appear here.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-6 py-10">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl md:text-3xl">Messages</CardTitle>
                            <CardDescription className="mt-2">
                                {sortedMessages.length} {sortedMessages.length === 1 ? 'message' : 'messages'} received
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            {sortedMessages.length}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] md:h-[700px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Name</TableHead>
                                    <TableHead className="w-[200px]">Email</TableHead>
                                    <TableHead className="min-w-[200px]">Subject</TableHead>
                                    <TableHead className="min-w-[300px]">Message</TableHead>
                                    <TableHead className="w-[180px]">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedMessages.map((message) => (
                                    <TableRow key={message.id} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="size-4 text-muted-foreground shrink-0" />
                                                <span className="font-medium">{message.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Mail className="size-4 text-muted-foreground shrink-0" />
                                                <a
                                                    href={`mailto:${message.email}`}
                                                    className="text-primary hover:underline break-all"
                                                >
                                                    {message.email}
                                                </a>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium max-w-[200px] truncate" title={message.subject}>
                                                {message.subject}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[300px]">
                                                <p className="text-sm text-muted-foreground line-clamp-2" title={message.message}>
                                                    {message.message}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="size-4 shrink-0" />
                                                <span>{formatDate(message.createdAt)}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Mobile Card View */}
            <div className="mt-6 space-y-4 md:hidden">
                {sortedMessages.map((message) => (
                    <Card key={message.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-lg flex items-center gap-2 mb-1">
                                        <User className="size-4 text-muted-foreground shrink-0" />
                                        <span className="truncate">{message.name}</span>
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Mail className="size-3 shrink-0" />
                                        <a
                                            href={`mailto:${message.email}`}
                                            className="text-primary hover:underline truncate"
                                        >
                                            {message.email}
                                        </a>
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="shrink-0 text-xs">
                                    <Calendar className="size-3 mr-1" />
                                    {formatDate(message.createdAt)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                                    <MessageSquare className="size-4 text-muted-foreground" />
                                    Subject
                                </h4>
                                <p className="text-sm">{message.subject}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold mb-1">Message</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word">
                                    {message.message}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
